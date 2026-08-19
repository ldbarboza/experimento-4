'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product, PRODUCT_TYPES, PRODUCT_STATUSES } from '@/types/product';
import { validateProduct, ProductInput } from '@/lib/validations';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';

interface ProductFormProps {
  initialData?: Product;
}

interface FormState {
  name: string;
  type: string;
  description: string;
  interestRate: string;
  status: string;
}

const emptyForm: FormState = {
  name: '',
  type: '',
  description: '',
  interestRate: '',
  status: '',
};

export function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter();
  const isEditing = !!initialData;

  const [form, setForm] = useState<FormState>(
    initialData
      ? {
          name: initialData.name,
          type: initialData.type,
          description: initialData.description ?? '',
          interestRate:
            initialData.interestRate !== undefined
              ? String(initialData.interestRate)
              : '',
          status: initialData.status,
        }
      : emptyForm
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
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

    setIsSubmitting(true);

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
          setServerError(data.error ?? 'Ocorreu um erro. Tente novamente.');
        }
        return;
      }

      const successParam = isEditing ? 'updated' : 'created';
      router.push(`/?success=${successParam}`);
    } catch {
      setServerError('Erro de conexão. Verifique sua internet e tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  }

  const typeOptions = PRODUCT_TYPES.map((t) => ({ value: t, label: t }));
  const statusOptions = PRODUCT_STATUSES.map((s) => ({ value: s, label: s }));

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {serverError && (
        <div
          role="alert"
          className="rounded-md bg-red-50 border border-red-200 p-4 text-sm text-red-700"
        >
          {serverError}
        </div>
      )}

      <Input
        label="Nome do Produto"
        id="name"
        name="name"
        type="text"
        value={form.name}
        onChange={handleChange}
        error={errors.name}
        placeholder="Ex: Conta Corrente Premium"
        required
        maxLength={100}
      />

      <Select
        label="Tipo"
        id="type"
        name="type"
        value={form.type}
        onChange={handleChange}
        options={typeOptions}
        placeholder="Selecione um tipo"
        error={errors.type}
        required
      />

      <Textarea
        label="Descrição"
        id="description"
        name="description"
        value={form.description}
        onChange={handleChange}
        error={errors.description}
        placeholder="Descreva o produto bancário..."
        maxLength={500}
        hint="Opcional. Máximo de 500 caracteres."
      />

      <Input
        label="Taxa de Juros (%)"
        id="interestRate"
        name="interestRate"
        type="number"
        value={form.interestRate}
        onChange={handleChange}
        error={errors.interestRate}
        placeholder="Ex: 12.99"
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
        options={statusOptions}
        placeholder="Selecione um status"
        error={errors.status}
        required
      />

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" variant="primary" isLoading={isSubmitting}>
          {isEditing ? 'Salvar Alterações' : 'Cadastrar Produto'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push('/')}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
