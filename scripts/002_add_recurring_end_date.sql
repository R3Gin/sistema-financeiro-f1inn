-- Adicionar coluna recurring_end_date para passivos recorrentes
ALTER TABLE public.expenses
ADD COLUMN IF NOT EXISTS recurring_end_date DATE;

-- Remover 'debito' das opções de payment_method
ALTER TABLE public.expenses
DROP CONSTRAINT IF EXISTS expenses_payment_method_check;

ALTER TABLE public.expenses
ADD CONSTRAINT expenses_payment_method_check 
CHECK (payment_method IN ('cartao', 'pix', 'boleto', 'dinheiro', 'transferencia'));
