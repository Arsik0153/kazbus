type Props = {
    label: string;
    value?: string;
    hint?: string;
};

const AdminInfoField = ({ label, value, hint }: Props) => {
    return (
        <div className="rounded-[18px] border border-[#E2E8F0] bg-[#F8FAFC] px-5 py-4">
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#A0A0A0]">
                {label}
            </p>
            <p className="mt-2 text-base font-semibold text-[#4A4A4A]">
                {value || 'Будет заполняться после подключения backend'}
            </p>
            {hint ? (
                <p className="mt-2 text-sm font-medium text-[#94A3B8]">{hint}</p>
            ) : null}
        </div>
    );
};

export default AdminInfoField;
