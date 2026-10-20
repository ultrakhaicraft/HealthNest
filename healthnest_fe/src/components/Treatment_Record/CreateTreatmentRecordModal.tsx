import { VaccineRecordCreateModel } from "../../models/VaccineRecordModel";
import inputStyles from '../../CSS/InputField.module.css'
import { useId, useRef, useState } from "react";
import Modal, { ModalForm, ModalField, ModalFooter } from "../GenericModal";
import { TreatmentRecordCreateModel } from "../../models/TreatmentRecordModel";
import recordStyles from '../../CSS/Nurse/VaccineTreatmentExtraStyle.module.css';
import { IconPlus } from "../IconList";


const MAX_RECORDS = 5;

interface CreateTreatmentRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: TreatmentRecordCreateModel[],studentHealthRecordId: string) => Promise<void> | void;
}

interface RecordRow {
  key: number; // stable React key, so removing a middle row doesn't shift the typed text
  treatmentTitle: string;
  description: string;
}

type RowField = 'treatmentTitle' | 'description';
type RowErrors = { [rowKey: number]: Partial<Record<RowField, string>> };



export const CreateTreatmentRecordModal = ({ isOpen, onClose, onSubmit }: CreateTreatmentRecordModalProps) => {
  const baseId = useId();
  const nextKey = useRef(1);
  const createRow = (): RecordRow => ({ key: nextKey.current++, treatmentTitle: '', description: '' });

  const [rows, setRows] = useState<RecordRow[]>(() => [createRow()]);
  const [errors, setErrors] = useState<RowErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [studenthealthRecordId, setStudentHealthRecordId] = useState<string>('');
  const [recordIdError, setRecordIdError] = useState<string | undefined>();

  const canAdd = rows.length < MAX_RECORDS;
  const canRemove = rows.length > 1;

  if (!isOpen) return null;

  const validate = () => {
    const errs: RowErrors = {};
    rows.forEach((row) => {
      const rowErrs: Partial<Record<RowField, string>> = {};
      const title = row.treatmentTitle.trim();
      const description = row.description.trim();

      if (!title) rowErrs.treatmentTitle = 'Treatment Title is required.';
      else if (title.length < 2 || title.length > 100) {
        rowErrs.treatmentTitle = 'Treatment Title must be between 2 and 100 characters.';
      }

      if (!description) rowErrs.description = 'Record description is required.';
      else if (description.length < 2 || description.length > 400) {
        rowErrs.description = 'Description must be between 2 and 400 characters.';
      }

      if (Object.keys(rowErrs).length > 0) errs[row.key] = rowErrs;
    });
    return errs;
  };

  const handleClear = () => {
    setRows([createRow()]);
    setErrors({});
    setFormError(null);
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


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const recordId = studenthealthRecordId.trim();
    let recordIdErr: string | undefined;
    if (!recordId) {
      recordIdErr = 'Student Health Record Id is required.';
    }
    setRecordIdError(recordIdErr);

    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setIsSubmitting(true);

    try {
      await onSubmit(rows.map((r)=>({
        treatmentTitle: r.treatmentTitle.trim(),
        description: r.description.trim(),
      })),
      studenthealthRecordId
    );
    } finally {
      setIsSubmitting(false);

    }

  };


  return (
    <Modal title="Create Treatment Record" onClose={onClose} isBusy={isSubmitting}>
      <ModalForm onSubmit={handleSubmit}>
       {formError && <div role="alert" className={recordStyles.formError}>{formError}</div>}

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


        <div className={recordStyles.recordList}>
          {rows.map((row, index) => {
            const titleId = `${baseId}-${row.key}-title`;
            const descriptionId = `${baseId}-${row.key}-description`;
            const rowErrors = errors[row.key] ?? {};

            return (
              <fieldset key={row.key} className={recordStyles.recordCard} disabled={isSubmitting}>
                <div className={recordStyles.recordHeader}>
                  <legend className={recordStyles.recordTitle}>Treatment record {index + 1}</legend>
                  {canRemove && (
                    <button
                      type="button"
                      className={recordStyles.removeButton}
                      onClick={() => removeRow(row.key)}
                      aria-label={`Remove treatment record ${index + 1}`}
                    >
                      Remove
                    </button>
                  )}
                </div>

                <ModalField label="Vaccine Title" htmlFor={titleId} error={rowErrors.treatmentTitle}>
                  <input
                    id={titleId}
                    className={inputStyles.inputField}
                    value={row.treatmentTitle}
                    onChange={(e) => updateRow(row.key, 'treatmentTitle', e.target.value)}
                    maxLength={100}
                    placeholder="Enter treatment record title"
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

         <div className={recordStyles.addRow}>
          <button
            type="button"
            className="button button-secondary"
            onClick={addRow}
            disabled={!canAdd || isSubmitting}
          >
            <IconPlus />
            Add another record
          </button>
          <span className={recordStyles.counter}>
            {rows.length} / {MAX_RECORDS}
          </span>
        </div>

        <ModalFooter>
          <button
            type="button"
            className="button button-secondary"
            onClick={handleClear}
            disabled={isSubmitting}
          >
            Clear
          </button>
          <button type="submit" className="button button-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : `Submit ${rows.length} record${rows.length >1 ? 's':''}`}
          </button>
        </ModalFooter>
      </ModalForm>
    </Modal>
  );
}