import { forwardRef } from 'react';

import { type Sprinkles, sprinkles } from './box.css';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface BoxProps extends React.PropsWithChildren<Sprinkles> {}

export const Box = forwardRef<HTMLDivElement, BoxProps>(
  ({ children, ...props }, ref) => {
    const { className, style, otherProps } = sprinkles(props);

    return (
      <div ref={ref} className={className} style={style} {...otherProps}>
        {children}
      </div>
    );
  },
);
