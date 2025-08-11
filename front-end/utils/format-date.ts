import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function formatDateWithCapitalizedDay(date: Date): string {
    const formatted = format(date, "EEEE' - 'dd/MM/yyyy", { locale: ptBR });
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}
