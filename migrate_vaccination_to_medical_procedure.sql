-- Migration: Rename 'vaccination' to 'medical_procedure' in health_records

ALTER TABLE health_records
  CHANGE COLUMN vaccination medical_procedure TEXT;

-- If you have any code or queries referencing 'vaccination', update them to 'medical_procedure'. 