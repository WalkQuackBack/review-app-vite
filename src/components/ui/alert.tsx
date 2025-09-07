import { Button, type ButtonAppearance } from './button';
import { ResponsiveDialogOrDrawer } from './ResponsiveDialogOrDrawer';

interface AlertProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  body: string;
  actions: {
    text: string;
    appearance: ButtonAppearance;
    callback: () => void;
  }[];
}

export function Alert({ isOpen, onClose, title, body, actions }: AlertProps) {
  return (
    <ResponsiveDialogOrDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={body}
      actions={
        <>
          {actions.map((action, index) => {
            return (
              <Button
                key={index}
                appearance={action.appearance}
                onClick={() => {
                  action.callback();
                  onClose(); 
                }}
              >
                {action.text}
              </Button>
            );
          })}
        </>
      }
    />
  );
}