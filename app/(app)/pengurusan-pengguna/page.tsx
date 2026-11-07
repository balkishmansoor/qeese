"use client";

import React, { useMemo, useState } from "react";
import { Plus, Pencil, Trash2, ShieldCheck, UserCog, GraduationCap } from "lucide-react";
import {
  Button, Card, Badge, Input, Select, Field, Modal,
  ConfirmDialog, EmptyState, SearchInput, useToast, uid,
  Table, THead, TBody, Tr, Th, Td,
} from "@/components/ui";
import { PageHeader } from "@/components/page-header";
import { useStore } from "@/lib/store";
import { User, Role } from "@/lib/types";
import { cn } from "@/components/ui";

const ROLE_META: Record<Role, { label: string; icon: React.ReactNode; tone: "purple" | "magenta" | "lavender" }> = {
  admin: { label: "Admin", icon: <ShieldCheck className="w-4 h-4" />, tone: "purple" },
  ketua_panitia: { label: "Ketua Panitia", icon: <UserCog className="w-4 h-4" />, tone: "magenta" },
  guru: { label: "Guru", icon: <GraduationCap className="w-4 h-4" />, tone: "lavender" },
};

const emptyUser: Omit<User, "id"> = { nama: "", email: "", jawatan: "", peranan: "guru", jabatanUnit: "" };

export default function PenggunaPage() {
  const { get, add, update, remove, ready, session } = useStore();
  const toast = useToast();
  const users = get("users");

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("semua");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [deleting, setDeleting] = useState<User | null>(null);
  const [form, setForm] = useState(emptyUser);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const myRole = session?.role;
  const isAdmin = myRole === "admin";

  const filtered = useMemo(() => {
    let list = users;
    if (roleFilter !== "semua") list = list.filter((u) => u.peranan === roleFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((u) => u.nama.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.jabatanUnit?.toLowerCase().includes(q));
    }
    return list;
  }, [users, search, roleFilter]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyUser);
    setErrors({});
    setModalOpen(true);
  };
  const openEdit = (u: User) => {
    setEditing(u);
    const { id, ...rest } = u;
    setForm(rest);
    setErrors({});
    setModalOpen(true);
  };

  const save = () => {
    const e: Record<string, string> = {};
    if (!form.nama.trim()) e.nama = "Nama diperlukan";
    if (!form.email.includes("@")) e.email = "Emel tidak sah";
    if (!form.jawatan.trim()) e.jawatan = "Jawatan diperlukan";
    setErrors(e);
    if (Object.keys(e).length) return;
    if (editing) {
      update("users", editing.id, { ...form });
      toast("Pengguna dikemas kini");
    } else {
      add("users", { ...form, id: uid() } as User);
      toast("Pengguna baharu ditambah");
    }
    setModalOpen(false);
  };

  if (!ready) return null;

  return (
    <div>
      <PageHeader
        title="Pengurusan Pengguna"
        subtitle="Uruskan akaun dan peranan pengguna sistem"
        actions={isAdmin ? <Button size="sm" onClick={openCreate}><Plus className="w-4 h-4" /> Tambah Pengguna</Button> : undefined}
      />

      {!isAdmin && (
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-700">
          Anda log masuk sebagai {ROLE_META[myRole as Role]?.label ?? myRole}. Hanya Admin boleh mengubah data pengguna.
        </div>
      )}

      <Card className="p-4 mb-4">
        <div className="grid sm:grid-cols-3 gap-3">
          <SearchInput value={search} onChange={setSearch} placeholder="Cari nama atau emel..." />
          <Select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
            <option value="semua">Semua Peranan</option>
            <option value="admin">Admin</option>
            <option value="ketua_panitia">Ketua Panitia</option>
            <option value="guru">Guru</option>
          </Select>
          <p className="text-xs text-slate-400 self-center">{filtered.length} pengguna</p>
        </div>
      </Card>

      <Card>
        {filtered.length === 0 ? (
          <EmptyState title="Tiada pengguna" />
        ) : (
          <Table>
            <THead><Tr><Th>Nama</Th><Th>Jawatan</Th><Th>Unit</Th><Th>Emel</Th><Th>Peranan</Th><Th className="text-right">Tindakan</Th></Tr></THead>
            <TBody>
              {filtered.map((u) => (
                <Tr key={u.id}>
                  <Td>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-lavender-200 text-lavender-700 flex items-center justify-center text-xs font-bold shrink-0">
                        {u.nama.charAt(0)}
                      </div>
                      <span className="font-medium">{u.nama}</span>
                    </div>
                  </Td>
                  <Td>{u.jawatan}</Td>
                  <Td>{u.jabatanUnit ?? "—"}</Td>
                  <Td className="text-slate-500">{u.email}</Td>
                  <Td><Badge tone={ROLE_META[u.peranan].tone}>{ROLE_META[u.peranan].label}</Badge></Td>
                  <Td>
                    {isAdmin && (
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => openEdit(u)}><Pencil className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="sm" className="text-red-500" disabled={u.id === session?.userId} onClick={() => setDeleting(u)}><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    )}
                  </Td>
                </Tr>
              ))}
            </TBody>
          </Table>
        )}
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Kemaskini Pengguna" : "Tambah Pengguna"}>
        <div className="space-y-4">
          <Field label="Nama Penuh" required error={errors.nama}>
            <Input value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} />
          </Field>
          <Field label="Emel" required error={errors.email}>
            <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </Field>
          <Field label="Jawatan" required error={errors.jawatan}>
            <Input value={form.jawatan} onChange={(e) => setForm({ ...form, jawatan: e.target.value })} placeholder="cth: Guru Matematik" />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Peranan">
              <Select value={form.peranan} onChange={(e) => setForm({ ...form, peranan: e.target.value as Role })}>
                <option value="guru">Guru</option>
                <option value="ketua_panitia">Ketua Panitia</option>
                <option value="admin">Admin</option>
              </Select>
            </Field>
            <Field label="Unit / Jabatan">
              <Input value={form.jabatanUnit ?? ""} onChange={(e) => setForm({ ...form, jabatanUnit: e.target.value })} />
            </Field>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={() => setModalOpen(false)}>Batal</Button>
          <Button onClick={save}>{editing ? "Simpan" : "Tambah"}</Button>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={() => {
          if (deleting) {
            remove("users", deleting.id);
            toast("Pengguna dipadam");
          }
        }}
        message={`Padam pengguna "${deleting?.nama}"?`}
      />
    </div>
  );
}
