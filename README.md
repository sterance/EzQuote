# EzQuote

Web/desktop application for building canned responses.

## Features

- Build and manage repair response templates
- Drag-and-drop template organization
- Cross-platform desktop app (Electron)

## Usage

EzQuote helps you create standardized customer responses using templates with placeholders.

### Create a Template Group

1. Click **Templates** in the navigation bar
2. Click **Add Group**
3. Enter a label (e.g., "Pool Equipment", "Appliance Repairs")
4. Click **Save**

### Add a Template with Placeholders

1. Click **Edit** on your group
2. Type your response using `{placeholder}` syntax
3. Example: `Your pool robot has {condition}, and this will require {requirement}.`
4. Click **Save**

### Add Values for Placeholders

1. After saving, click **Add Value** next to each placeholder
2. Enter specific values (e.g., "not holding a charge" for `{condition}`)
3. Add multiple values per placeholder
4. Click **Save**

### Generate a Quote

1. Click **Output** in the navigation bar
2. Check the boxes for template groups to include
3. Select or type values for placeholders
4. Click **Copy to Clipboard**

### Manage Templates

- **Reorder**: Drag the handle next to group names
- **Edit**: Click Edit on any group
- **Delete**: Click Delete (with confirmation)
- **Export**: Click **Export Templates** to save as JSON
- **Import**: Click **Import Templates** to load a JSON file

### Reset

- **Output page**: Click **Clear All** to uncheck all groups
- **Templates**: Click **Clear Templates** to remove all groups

## Tech Stack

- React 19 + TypeScript
- Vite
- Electron
- Material UI + dnd-kit

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build:electron
```

Output: `release/EzQuote-<version>.exe`
