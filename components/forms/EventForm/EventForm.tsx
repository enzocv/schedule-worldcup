'use client';

import React, { useState, useEffect } from 'react';
import { CalendarEvent, EventFormData, EventCategory } from '@/lib/types/event.types';
import { validateEventForm } from '@/lib/utils/validation.utils';
import { generateId } from '@/lib/utils/helpers';
import Input from '@/components/ui/Input/Input';
import TextArea from '@/components/ui/TextArea/TextArea';
import Select from '@/components/ui/Select/Select';
import Button from '@/components/ui/Button/Button';
import styles from './EventForm.module.css';

export interface EventFormProps {
  event?: CalendarEvent;
  initialDate?: string;
  onSubmit: (event: CalendarEvent) => void;
  onCancel: () => void;
}

export default function EventForm({ event, initialDate, onSubmit, onCancel }: EventFormProps) {
  const [formData, setFormData] = useState<EventFormData>({
    title: event?.title || '',
    description: event?.description || '',
    date: event?.date || initialDate || new Date().toISOString().split('T')[0],
    startTime: event?.startTime || '09:00',
    endTime: event?.endTime || '10:00',
    category: event?.category || 'work',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categoryOptions = [
    { value: 'work' as EventCategory, label: 'Trabajo' },
    { value: 'personal' as EventCategory, label: 'Personal' },
    { value: 'meeting' as EventCategory, label: 'Reunión' },
    { value: 'other' as EventCategory, label: 'Otro' },
  ];

  const handleChange = (
    field: keyof EventFormData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Limpiar error del campo al cambiar
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const validationErrors = validateEventForm(formData);

    if (validationErrors.length > 0) {
      const errorMap: Record<string, string> = {};
      validationErrors.forEach((error) => {
        errorMap[error.field] = error.message;
      });
      setErrors(errorMap);
      setIsSubmitting(false);
      return;
    }

    const now = new Date().toISOString();
    const eventData: CalendarEvent = {
      id: event?.id || generateId(),
      ...formData,
      createdAt: event?.createdAt || now,
      updatedAt: now,
    };

    onSubmit(eventData);
    setIsSubmitting(false);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <Input
        label="Título *"
        value={formData.title}
        onChange={(e) => handleChange('title', e.target.value)}
        error={errors.title}
        placeholder="Ej: Reunión con el equipo"
        fullWidth
        autoFocus
      />

      <TextArea
        label="Descripción"
        value={formData.description}
        onChange={(e) => handleChange('description', e.target.value)}
        error={errors.description}
        placeholder="Detalles del evento..."
        fullWidth
        rows={3}
      />

      <Input
        label="Fecha *"
        type="date"
        value={formData.date}
        onChange={(e) => handleChange('date', e.target.value)}
        error={errors.date}
        fullWidth
      />

      <div className={styles.timeRow}>
        <Input
          label="Hora de inicio *"
          type="time"
          value={formData.startTime}
          onChange={(e) => handleChange('startTime', e.target.value)}
          error={errors.startTime}
          fullWidth
        />

        <Input
          label="Hora de fin *"
          type="time"
          value={formData.endTime}
          onChange={(e) => handleChange('endTime', e.target.value)}
          error={errors.endTime}
          fullWidth
        />
      </div>

      <Select
        label="Categoría *"
        value={formData.category}
        onChange={(e) => handleChange('category', e.target.value as EventCategory)}
        error={errors.category}
        options={categoryOptions}
        fullWidth
      />

      <div className={styles.actions}>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary" loading={isSubmitting}>
          {event ? 'Actualizar' : 'Crear'} Evento
        </Button>
      </div>
    </form>
  );
}
