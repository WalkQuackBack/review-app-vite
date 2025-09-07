import { useEffect, useRef, useState } from "react";
import { Drawer } from "vaul";

interface ResponsiveDialogOrDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  children: React.ReactNode;
  actions: React.ReactNode;
}

export function ResponsiveDialogOrDrawer({
  isOpen,
  onClose,
  title,
  description,
  children,
  actions,
}: ResponsiveDialogOrDrawerProps) {
  const [isMobile, setIsMobile] = useState(false);
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return;
    if (isOpen) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [isMobile, isOpen])

  if (isMobile) {
    return (
      <Drawer.Root open={isOpen} onOpenChange={onClose}>
        <Drawer.Portal>
          <Drawer.Overlay className="responsive-drawer-overlay" />
          <Drawer.Content className="responsive-drawer-content">
            <Drawer.Handle className="responsive-drawer-handle" />
            <div className="responsive-drawer-header">
              <Drawer.Title className="responsive-drawer-title title-l">{title}</Drawer.Title>
              <Drawer.Description className="responsive-drawer-description body-m">
                {description}
              </Drawer.Description>
            </div>
            <div className="responsive-drawer-body">
              {children}
            </div>
            <div className="responsive-drawer-actions">
              {actions}
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    );
  }

  return (
    <dialog ref={dialogRef} onClose={onClose} className="responsive-dialog-content">
      <div className="responsive-dialog-header">
        <h2 className="responsive-dialog-title title-l">{title}</h2>
        <p className="responsive-dialog-description body-m">
          {description}
        </p>
      </div>
      <div className="responsive-dialog-body">
        {children}
      </div>
      <div className="responsive-dialog-actions">
        {actions}
      </div>
    </dialog>
  );
}