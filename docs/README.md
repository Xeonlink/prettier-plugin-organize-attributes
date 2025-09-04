<br/>

<p align='center'>
  <img src="https://capsule-render.vercel.app/api?type=waving&color=FFFFFF&height=260&section=header&text=prettier-plugin-organize-attributes&fontSize=44&animation=fadeIn&fontAlignY=32&desc=organize+attributes+automatically&descAlignY=48&descAlign=50"/>
</p>

## 📖 Overview

This project is based on [prettier-plugin-organize-attributes](https://github.com/NiklasPor/prettier-plugin-organize-attributes), but adds additional features

<div>
  <img src="https://img.shields.io/badge/HTML-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML" />
  <img src="https://img.shields.io/badge/JSX-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="JSX" />
  <img src="https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white" alt="Angular" />
  <img src="https://img.shields.io/badge/Vue.js-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white" alt="Vue.js" />
  <img src="https://img.shields.io/badge/Svelte-FF3E00?style=for-the-badge&logo=svelte&logoColor=white" alt="Svelte" />
</div>

```bash
npm i -D @xeonlink/prettier-plugin-organize-attributes
```

- [Options](#options)
  - [attributeGroups](#attributegroups)
  - [attributeSort](#attributesort)
  - [attributeIgnoreCase](#attributeignorecase)
- [Compatability](#compatibility)
  - [prettier-plugin-tailwindcss](#prettier-plugin-tailwindcss)
  - [prettier-plugin-svelte](#svelte)

## ⚙️ Options

### attributeGroups

```json
{
  "plugins": ["@xeonlink/prettier-plugin-organize-attributes"],
  "attributeGroups": ["^class$", "^(id|name)$", "$DEFAULT", "^aria-"]
}
```

```html
<!-- input -->
<div aria-disabled="true" name="myname" id="myid" class="myclass" src="other"></div>

<!-- output -->
<div class="myclass" name="myname" id="myid" src="other" aria-disabled="true"></div>
```

- Groups attributes by name.
- Groups are expressed using regular expressions, and attributes that satisfy the regular expression are grouped together.
- If an attribute name satisfies multiple regular expressions, it belongs to the group that comes first.
- There are predefined [`PRESET`](../src/presets.ts) configurations.
- If an attribute doesn't belong to any group, it belongs to the `$DEFAULT` group.

---

### attributeSort

```json
{
  "plugins": ["@xeonlink/prettier-plugin-organize-attributes"],
  "attributeGroups": ["$DEFAULT", "^data-"],
  "attributeSort": "ASC"
}
```

```html
<!-- input -->
<div a="a" c="c" b="b" data-c="c" data-a="a" data-b="b"></div>

<!-- output -->
<div a="a" b="b" c="c" data-a="a" data-b="b" data-c="c"></div>
```

- Sorts attributes within groups.
- Sorting occurs within groups and does not affect other groups.

| Value            | Description                                  |
| ---------------- | -------------------------------------------- |
| `NONE` (default) | No sorting (maintains original order)        |
| `ASC`            | Ascending sort (alphabetical order)          |
| `DESC`           | Descending sort (reverse alphabetical order) |

<div style="height: 8px"></div>

---

### attributeIgnoreCase

```json
{
  "plugins": ["@xeonlink/prettier-plugin-organize-attributes"],
  "attributeGroups": ["^group-a$", "^group-b$", "^group-A$", "^group-B$"],
  "attributeIgnoreCase": false // default true
}
```

```html
<!-- input -->
<div group-b group-B group-A group-a></div>

<!-- output -->
<div group-a group-b group-A group-B></div>
```

- Sets whether the group's regular expression is case-sensitive.
- This option defaults to `true`, so if the option is not specified, the regular expression is case-insensitive.

## 🔗 Compatibility

This [plugin](#overview) works by dynamically importing and calling parsers from plugins with lower priority to avoid conflicts with other plugins, and then modifying the AST. Therefore, if prettier doesn't have built-in support for a parser, you need to use it together with a plugin that has that parser. (e.g., [prettier-plugin-svelte](#svelte))

### prettier-plugin-tailwindcss

<!-- prettier-ignore -->
```json
{
  "plugins": [
    "prettier-plugin-tailwindcss", // call relevant parser
    "@xeonlink/prettier-plugin-organize-attributes"
  ]
}
```

### prettier-plugin-svelte

<!-- prettier-ignore -->
```json
{
  "plugins": [
    "prettier-plugin-svelte", // call svelte parser
    "@xeonlink/prettier-plugin-organize-attributes"
  ]
}
```
