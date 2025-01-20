---
title: "Code variations"
layout: "layouts/markdown.njk"
excerpt: ""
date: 2025-01-10 11:22:26
modified: 2025-01-10 11:42:03
file_type: md
permalink: code-variation.html
tags: []
featured_img: 
wpid: 70
---

# Code variations

NJK

```
<pre class="wp-block-code is-style-twig">```twig
{%- for color in theme.settings.color.palette %}
--wp--preset--color--{{ color.slug }}: {{ color.color }};
{%- endfor %}
```
```

JSON

```
<pre class="wp-block-code is-style-json">```json
{
	"$schema": "https://schemas.wp.org/trunk/theme.json",
	"version": 3,
	"settings": {
        }
}
```
```