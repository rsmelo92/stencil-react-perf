import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'my-second',
  styleUrl: 'my-second.css',
  shadow: true,
})
export class MySecond {

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
