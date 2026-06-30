interface FormSectionProps {
    icon: React.ReactNode;
    title: string;
    children: React.ReactNode;
    formSectionClassName?: string;
    headerClassName?: string;
    titleClassName?: string;
}
// Form Section Component - A reusable wrapper for form fields
 const FormSection = ({ icon, title, children, formSectionClassName='', headerClassName='', titleClassName } : FormSectionProps) => (
  <div className={formSectionClassName}>
    <div className={headerClassName}>
      {icon}
      <h3 className={titleClassName}>{title}</h3>
    </div>
    {children}
  </div>
);

export default FormSection;