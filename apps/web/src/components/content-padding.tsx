import React from 'react';

type Props = {
  children: React.ReactNode;
};

const ContentPadding = (props: Props) => {
  return (
    <main
      className="px-4 sm:px-8
      py-6 sm:py-8
      md:px-12 md:py-10
      lg:px-16 lg:py-12
      xl:px-20 xl:py-16
      2xl:px-24 2xl:py-20"
    >
      {props.children}
    </main>
  );
};

export default ContentPadding;
