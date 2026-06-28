import { ReactNode } from "react";

interface ContainerProps {
  id?: string;
  children: ReactNode;
  className?: string;
}

export default function Container({ id, children, className = "" }: ContainerProps) {
  return (
    <section id={id} className={`mx-auto w-full max-w-[1180px] px-6 md:px-12 ${className}`}>
      {children}
    </section>
  );
}
