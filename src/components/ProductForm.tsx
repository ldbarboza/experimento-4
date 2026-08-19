'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Product, PRODUCT_TYPES, PRODUCT_STATUSES } from '@/types/product';
import { validateProduct, ProductInput } from '@/lib/validations';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

interface ProductFormProps {
  initialData?: Product;
}

const typeOptions = PRODUCT_TYPES.map((t) => ({ value: t, label: t }));
const statusOptions = PRODUCT_STATUSES.map((s) => ({ value: s, label: s }));

export function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter();
  const isEditing = Boolean(initialData);

  const [formData, setFormData] = useState({
    name: initialData?.name ?? '',
    type: initialData?.type ?? '',
    description: initialData?.description ?? '',
    interestRate:
      initialData?.interestRate !== undefined
        ? String(initialData.interestRate)
        : '',
    status: initialData?.status ?? '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setServerError('');

    // Client-side validation
    const input: ProductInput = {
      name: formData.name,
      type: formData.type,
      description: formData.description || undefined,
      interestRate: formData.interestRate !== '' ? formData.interestRate : undefined,
      status: formData.status,
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
        name: formData.name.trim(),
        type: formData.type,
        description: formData.description.trim() || undefined,
        interestRate:
          formData.interestRate !== '' ? Number(formData.interestRate) : undefined,
        status: formData.status,
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
        label="Nome do produto"
        name="name"
        id="name"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
        required
        placeholder="Ex: Conta Corrente Digital"
        maxLength={100}
      />

      <Select
        label="Tipo"
        name="type"
        id="type"
        value={formData.type}
        onChange={handleChange}
        error={errors.type}
        required
        options={typeOptions}
        placeholder="Selecione um tipo"
      />

      <div className="flex flex-col gap-1">
        <label
          htmlFor="description"
          className="text-sm font-medium text-gray-700"
        >
          Descrição
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          maxLength={500}
          placeholder="Descreva o produto bancário..."
          className={[
            'block w-full rounded-md border px-3 py-2 text-sm shadow-sm resize-none',
            'placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
            'transition-colors duration-150',
            errors.description
              ? 'border-red-400 bg-red-50'
              : 'border-gray-300 bg-white',
          ].join(' ')}
        />
        <div className="flex justify-between">
          {errors.description ? (
            <p className="text-xs text-red-600" role="alert">
              {errors.description}
            </p>
          ) : (
            <span />
          )}
          <p className="text-xs text-gray-400">
            {formData.description.length}/500
          </p>
        </div>
      </div>

      <Input
        label="Taxa de juros (%)"
        name="interestRate"
        id="interestRate"
        type="number"
        value={formData.interestRate}
        onChange={handleChange}
        error={errors.interestRate}
        placeholder="Ex: 2.49"
        min={0}
        max={100}
        step={0.01}
        hint="Opcional. Informe um valor entre 0 e 100."
      />

      <Select
        label="Status"
        name="status"
        id="status"
        value={formData.status}
        onChange={handleChange}
        error={errors.status}
        required
        options={statusOptions}
        placeholder="Selecione um status"
      />

      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push('/')}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {isSubmitting
            ? isEditing
              ? 'Salvando...'
              : 'Cadastrando...'
            : isEditing
              ? 'Salvar alterações'
              : 'Cadastrar produto'}
        </Button>
      </div>
    </form>
  );
}
