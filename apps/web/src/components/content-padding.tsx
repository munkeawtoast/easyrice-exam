import React from 'react';

type Props = {
  children: React.ReactNode;
};

const ContentPadding = (props: Props) => {
  return (
    <main
      className="px-4 sm:px-8
      py-6
      md:px-12
      lg:px-16
      xl:px-20
      2xl:px-24"
    >
      {props.children}
    </main>
  );
};

export default ContentPadding;
