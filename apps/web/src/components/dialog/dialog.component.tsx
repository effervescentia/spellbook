import { Box } from '@web/components/box/box.component';
import { template } from '@web/utils/template.util';
import { useContext } from 'react';

import { DialogContext } from './dialog.context';

const CancelButton: React.FC = () => {
  const { close } = useContext(DialogContext);

  return <button onClick={close}>Cancel</button>;
};

export const Dialog = template(
  ['Body', 'Actions'],
  ({ children, Body, Actions }) => (
    <Box>
      <Box>
        <Body />
      </Box>
      {children}
      <Box>
        <CancelButton />
        <Actions />
      </Box>
    </Box>
  ),
);
