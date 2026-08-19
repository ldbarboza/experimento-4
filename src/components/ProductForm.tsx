'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product, PRODUCT_TYPES, PRODUCT_STATUSES } from '@/types/product';
import { validateProduct, ProductInput } from '@/lib/validations';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

interface ProductFormProps {
  initialData?: Product;
}

const typeOptions = PRODUCT_TYPES.map((t) => ({ value: t, label: t }));
const statusOptions = PRODUCT_STATUSES.map((s) => ({ value: s, label: s }));

export function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter();
  const isEditing = Boolean(initialData);

  const [form, setForm] = useState({
    name: initialData?.name ?? '',
    type: initialData?.type ?? '',
    description: initialData?.description ?? '',
    interestRate: initialData?.interestRate !== undefined ? String(initialData.interestRate) : '',
    status: initialData?.status ?? '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);

    // Client-side validation
    const input: ProductInput = {
      name: form.name,
      type: form.type,
      description: form.description || undefined,
      interestRate: form.interestRate !== '' ? form.interestRate : undefined,
      status: form.status,
    };

    const validation = validateProduct(input);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);
    try {
      const url = isEditing
        ? `/api/products/${initialData!.id}`
        : '/api/products';
      const method = isEditing ? 'PUT' : 'POST';

      const payload = {
        name: form.name.trim(),
        type: form.type,
        description: form.description.trim() || undefined,
        interestRate: form.interestRate !== '' ? Number(form.interestRate) : undefined,
        status: form.status,
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setServerError(data.error ?? 'Ocorreu um erro inesperado.');
        }
        return;
      }

      const successParam = isEditing ? 'updated' : 'created';
      router.push(`/?success=${successParam}`);
    } catch {
      setServerError('Não foi possível conectar ao servidor. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {serverError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {serverError}
        </div>
      )}

      <Input
        label="Nome do Produto"
        id="name"
        name="name"
        value={form.name}
        onChange={handleChange}
        error={errors.name}
        required
        placeholder="Ex: Conta Corrente Digital"
        maxLength={100}
      />

      <Select
        label="Tipo"
        id="type"
        name="type"
        value={form.type}
        onChange={handleChange}
        error={errors.type}
        required
        placeholder="Selecione um tipo"
        options={typeOptions}
      />

      <div className="flex flex-col gap-1">
        <label htmlFor="description" className="text-sm font-medium text-gray-700">
          Descrição
        </label>
        <textarea
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={3}
          maxLength={500}
          placeholder="Descreva o produto bancário (opcional)"
          className={[
            'rounded-lg border px-3 py-2 text-sm shadow-sm transition-colors resize-none',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
            errors.description
              ? 'border-red-400 bg-red-50'
              : 'border-gray-300 bg-white',
          ].join(' ')}
        />
        <div className="flex justify-between">
          {errors.description ? (
            <p className="text-xs text-red-600">{errors.description}</p>
          ) : (
            <span />
          )}
          <p className="text-xs text-gray-400">{form.description.length}/500</p>
        </div>
      </div>

      <Input
        label="Taxa de Juros (%)"
        id="interestRate"
        name="interestRate"
        type="number"
        value={form.interestRate}
        onChange={handleChange}
        error={errors.interestRate}
        placeholder="Ex: 2.49"
        min={0}
        max={100}
        step={0.01}
        hint="Opcional. Valor entre 0 e 100."
      />

      <Select
        label="Status"
        id="status"
        name="status"
        value={form.status}
        onChange={handleChange}
        error={errors.status}
        required
        placeholder="Selecione um status"
        options={statusOptions}
      />

      <div className="flex gap-3 pt-2">
        <Button type="submit" loading={loading} disabled={loading}>
          {isEditing ? 'Salvar Alterações' : 'Cadastrar Produto'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push('/')}
          disabled={loading}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
