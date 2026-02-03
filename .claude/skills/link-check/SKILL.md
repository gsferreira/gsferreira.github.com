---
name: link-check
description: Validate internal and external links in blog posts. Finds broken links and suggests fixes.
argument-hint: "[file path or --all or --recent]"
---

# Link Check

Validate internal and external links in blog posts.

## Instructions

1. Determine scope from $ARGUMENTS:
   - If a file path is provided, check that specific post
   - If `--all` flag is used, check all posts
   - If `--recent` flag is used, check posts from the last 6 months
   - Otherwise, ask the user what to check

2. For the specified scope, extract and validate all links:

### Internal Links
- Links starting with `/` or relative paths
- Links to `/archive/...` posts
- Links to `/courses/...` pages
- Links to `/workshops/...` pages

For each internal link:
- Check if the target file exists
- Report broken links with the source file and line number

### External Links
- Links starting with `http://` or `https://`
- YouTube embeds (plain URLs that get embedded)

For each external link:
- Attempt to fetch the URL (HEAD request)
- Report any that return 4xx or 5xx errors
- Flag any HTTP links that should be HTTPS

3. Generate a report:

```
## Link Check Report

### Summary
- Total links checked: X
- Internal links: X (Y broken)
- External links: X (Y broken/unreachable)

### Broken Internal Links
| Source File | Line | Broken Link | Suggestion |
|-------------|------|-------------|------------|
| ... | ... | ... | ... |

### Broken External Links
| Source File | Line | URL | Status |
|-------------|------|-----|--------|
| ... | ... | ... | ... |

### Warnings
- HTTP links that should be HTTPS
- Redirected URLs (suggest updating)
```

4. Offer to help fix any broken internal links by:
   - Suggesting the correct path
   - Finding similar posts if the target was moved/renamed

## Notes

- External link checking may be slow for large scopes
- Some external sites may block automated requests (false positives)
- YouTube URLs are validated but not fetched (they're usually fine)
