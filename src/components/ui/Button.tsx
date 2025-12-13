import Link, { LinkProps } from 'next/link';
import React from 'react';

const cx = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(' ');

type BaseProps = {
  variant?: 'primary' | 'secondary' | 'ghost';
  fullWidth?: boolean;
  className?: string;
  children: React.ReactNode;
};

type ButtonAsButton = BaseProps & React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type ButtonAsLink = BaseProps & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & { href: string } & LinkProps;

type ButtonProps = ButtonAsButton | ButtonAsLink;

export default function Button(props: ButtonProps) {
  const { variant = 'primary', fullWidth = false, className, children, ...rest } = props as ButtonProps;

  const sharedClasses = cx(
    'liquid-button',
    `liquid-button--${variant}`,
    'text-sm sm:text-base focus-visible:outline-none focus-visible:ring-0',
    fullWidth && 'w-full',
    className,
  );

  if ('href' in props && props.href) {
    const { href, ...anchorProps } = props as ButtonAsLink;
    return (
      <Link href={href} className={sharedClasses} {...anchorProps}>
        {children}
      </Link>
    );
  }

  const buttonProps = rest as ButtonAsButton;

  return (
    <button type={buttonProps.type ?? 'button'} {...buttonProps} className={sharedClasses}>
      {children}
    </button>
  );
}
