import React, { useId, useRef, useState } from 'react';
import { IconPlus } from '../IconList';
import inputStyles from '../../CSS/InputField.module.css';
import styles from '../../app/CSS/Components/VaccineRecordModal.module.css';
import vaccineStyles from '../../CSS/Nurse/VaccineTreatmentExtraStyle.module.css';
import { VaccineRecordCreateModel } from '../../models/VaccineRecordModel';
import Modal, { ModalForm, ModalField, ModalFooter } from '../GenericModal';

const MAX_RECORDS = 5;

interface CreateVaccineRecordModalProps {
  /** Every record created in this modal is attached to this student health record */
  onClose: () => void;
  onSubmit: (payload: VaccineRecordCreateModel[], studentHealthRecordId: string) => Promise<void> | void;
}



interface RecordRow {
  key: number; // stable React key, so removing a middle row doesn't shift the typed text
  vaccineTitle: string;
  description: string;
}

type RowField = 'vaccineTitle' | 'description';
type RowErrors = { [rowKey: number]: Partial<Record<RowField, string>> };

export const CreateVaccineRecordModal = ({
  onClose,
  onSubmit,
}: CreateVaccineRecordModalProps) => {
  const baseId = useId();
  const nextKey = useRef(1);
  const createRow = (): RecordRow => ({ key: nextKey.current++, vaccineTitle: '', description: '' });

  const [rows, setRows] = useState<RecordRow[]>(() => [createRow()]);
  const [errors, setErrors] = useState<RowErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [studenthealthRecordId, setStudentHealthRecordId] = useState<string>('');
  const [recordIdError, setRecordIdError] = useState<string | undefined>();

  const canAdd = rows.length < MAX_RECORDS;
  const canRemove = rows.length > 1;

  const validate = (): RowErrors => {
    const errs: RowErrors = {};
    rows.forEach((row) => {
      const rowErrs: Partial<Record<RowField, string>> = {};
      const title = row.vaccineTitle.trim();
      const description = row.description.trim();

      if (!title) rowErrs.vaccineTitle = 'Vaccine Title is required.';
      else if (title.length < 2 || title.length > 100) {
        rowErrs.vaccineTitle = 'Vaccine Title must be between 2 and 100 characters.';
      }

      if (!description) rowErrs.description = 'Record description is required.';
      else if (description.length < 2 || description.length > 400) {
        rowErrs.description = 'Description must be between 2 and 400 characters.';
      }

      if (Object.keys(rowErrs).length > 0) errs[row.key] = rowErrs;
    });
    return errs;
  };

  const updateRow = (key: number, field: RowField, value: string) => {
    setRows((prev) => prev.map((r) => (r.key === key ? { ...r, [field]: value } : r)));
    // clear the error of the field being edited
    setErrors((prev) => {
      if (!prev[key]?.[field]) return prev;
      return { ...prev, [key]: { ...prev[key], [field]: undefined } };
    });
  };

  const addRow = () => {
    if (canAdd) setRows((prev) => [...prev, createRow()]);
  };

  const removeRow = (key: number) => {
    if (!canRemove) return;
    setRows((prev) => prev.filter((r) => r.key !== key));
    setErrors((prev) => {
      const { [key]: _removed, ...rest } = prev;
      return rest;
    });
  };

  const handleClear = () => {
    setRows([createRow()]);
    setErrors({});
    setFormError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const recordId = studenthealthRecordId .trim();
    let recordIdErr: string | undefined;
    if (!recordId) {
      recordIdErr = 'Student Health Record Id is required.';
    }
    // Optional: only if your backend IDs are GUIDs
    // else if (!/^[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(recordId)) {
    //   recordIdErr = 'Student Health Record Id must be a valid GUID.';
    // }
    setRecordIdError(recordIdErr);

    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setIsSubmitting(true);
    try {
      await onSubmit(
        rows.map((r) => ({
          vaccineTitle: r.vaccineTitle.trim(),
          description: r.description.trim(),
        })),
        studenthealthRecordId
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal title="Create Vaccine Records" onClose={onClose} isBusy={isSubmitting} size="lg">
      <ModalForm onSubmit={handleSubmit}>
        {formError && <div role="alert" className={vaccineStyles.formError}>{formError}</div>}

        <ModalField label="Student Health Record Id" htmlFor='student-health-record-id' >
          <input
            id='student-health-record-id'
            className={inputStyles.inputField}
            value={studenthealthRecordId}
            onChange={(e) => {
              setStudentHealthRecordId(e.target.value)
              if (recordIdError) setRecordIdError(undefined);
            }
            }
            maxLength={100}
            placeholder="Enter existing student health record Id"
            required
          />
        </ModalField>


        <div className={vaccineStyles.recordList}>
          {rows.map((row, index) => {
            const titleId = `${baseId}-${row.key}-title`;
            const descriptionId = `${baseId}-${row.key}-description`;
            const rowErrors = errors[row.key] ?? {};

            return (
              <fieldset key={row.key} className={vaccineStyles.recordCard} disabled={isSubmitting}>
                <div className={vaccineStyles.recordHeader}>
                  <legend className={vaccineStyles.recordTitle}>Vaccine record {index + 1}</legend>
                  {canRemove && (
                    <button
                      type="button"
                      className={vaccineStyles.removeButton}
                      onClick={() => removeRow(row.key)}
                      aria-label={`Remove vaccine record ${index + 1}`}
                    >
                      Remove
                    </button>
                  )}
                </div>

                <ModalField label="Vaccine Title" htmlFor={titleId} error={rowErrors.vaccineTitle}>
                  <input
                    id={titleId}
                    className={inputStyles.inputField}
                    value={row.vaccineTitle}
                    onChange={(e) => updateRow(row.key, 'vaccineTitle', e.target.value)}
                    maxLength={100}
                    placeholder="Enter vaccine record title"
                    required
                  />
                </ModalField>

                <ModalField label="Record Description" htmlFor={descriptionId} error={rowErrors.description}>
                  <textarea
                    id={descriptionId}
                    className={inputStyles.textareaField}
                    value={row.description}
                    onChange={(e) => updateRow(row.key, 'description', e.target.value)}
                    maxLength={400}
                    rows={3}
                    placeholder="Enter record description"
                    required
                  />
                </ModalField>
              </fieldset>
            );
          })}
        </div>

        <div className={vaccineStyles.addRow}>
          <button
            type="button"
            className="button button-secondary"
            onClick={addRow}
            disabled={!canAdd || isSubmitting}
          >
            <IconPlus />
            Add another record
          </button>
          <span className={vaccineStyles.counter}>
            {rows.length} / {MAX_RECORDS}
          </span>
        </div>

        <ModalFooter>
          <button type="button" className="button button-secondary" onClick={handleClear} disabled={isSubmitting}>
            Clear
          </button>
          <button type="submit" className="button button-primary" disabled={isSubmitting}>
            {isSubmitting
              ? 'Submitting...'
              : `Submit ${rows.length} record${rows.length > 1 ? 's' : ''}`}
          </button>
        </ModalFooter>
      </ModalForm>
    </Modal>
  );
};