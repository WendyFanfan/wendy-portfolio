# Original artwork files

Drop original, full-quality files here (JPG / PNG / WebP / TIFF):

- `content/photography/` — photographs
- `content/paintings/` — oil paintings (photograph them straight-on, evenly lit, cropped to the canvas)

Then run:

```bash
npm run images
```

This creates optimized WebP sizes in `public/images/<collection>/`, strips all metadata
(including GPS location), and updates `src/data/image-manifest.json`.

Finally add an entry in `src/data/photography.ts` or `src/data/paintings.ts` with
`image: '<key>'` — the key is the file name in lowercase with dashes
(`Dresden Altstadt 01.jpg` → `dresden-altstadt-01`).

Originals are git-ignored (they can be large); the optimized files in `public/images/` are committed.
