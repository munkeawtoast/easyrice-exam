import React from 'react';

type Props = {
  children: React.ReactNode;
  header?: string;
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
      {props.header && (
        <h1 className="text-4xl text-center pb-4">{props.header}</h1>
      )}
      {props.children}
    </main>
  );
};

export default ContentPadding;
