# Taboola Managed Component

## Documentation

Managed Components docs are published at **https://managedcomponents.dev** .

Find out more about Managed Components [here](https://blog.cloudflare.com/zaraz-open-source-managed-components-and-webcm/) for inspiration and motivation details.

[![Released under the Apache license.](https://img.shields.io/badge/license-apache-blue.svg)](./LICENSE)
[![PRs welcome!](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](./CONTRIBUTING.md)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![All Contributors](https://img.shields.io/github/all-contributors/managed-components/snapchat?color=ee8449&style=flat-square)](#contributors)

## 🚀 Quickstart local dev environment

1. Make sure you're running node version >=18.
2. Install dependencies with `npm i`
3. Run unit test watcher with `npm run test:dev`

## ⚙️ Tool Settings

> Settings are used to configure the tool in a Component Manager config file

### Account ID `string`

Find your account ID in the Taboola Pixel section of your Taboola Ads dashboard. [Learn more](https://help.taboola.com/hc/en-us/articles/360003469854-Taboola-Pixel-Overview)

## 🧱 Fields Description

> Fields are properties that can/must be sent with certain events

### Event name `string`

`en` defines Taboola's event name. [Learn more](https://help.taboola.com/hc/en-us/articles/360003484314-Defining-and-Creating-Conversions)

### Custom event name `string`

`custom_en` should be provided when 'Custom event name' is selected as `en`

### Revenue `string`

`revenue` is the value of the transaction. Recommended to use along with Purchase event. Must be an integer or decimal value. [Learn more](https://help.taboola.com/hc/en-us/articles/360009027493-Tracking-Dynamic-Conversion-Values)

### Currency `string`

`currency` of the transaction. Recommended to use along with Purchase event. Must be an integer or decimal value. [Learn more](https://help.taboola.com/hc/en-us/articles/360009027493-Tracking-Dynamic-Conversion-Values)

### Order ID `string`

`orderId` of the transaction. Recommended to use along with Purchase event. Must be an integer or decimal value. [Learn more](https://help.taboola.com/hc/en-us/articles/360009027493-Tracking-Dynamic-Conversion-Values)

## 📝 License

Licensed under the [Apache License](./LICENSE).
