import { Box, Typography, List, ListItem, ListItemText, Paper } from "@mui/material";
import sampleTemplatesUrl from "../data/sample-templates.json?url";

export function Help() {
  return (
    <Box className="help-sections" sx={{ position: "relative", p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Welcome to EzQuote
      </Typography>
      <Typography variant="body1">
        A tool that helps you create standardised customer responses. Think of it as a template builder for communication. You can create "templates" that contain placeholders, then fill those placeholders with specific details when generating quotes for customers. If you would like to see an example,{" "}
        <a href={sampleTemplatesUrl} download="sample-templates.json">
          download the sample templates
        </a>{" "}
        and import them with the "Import Templates" button on the Templates page.
      </Typography>

      <Paper sx={{ py: 2, pl: 2, mb: 2 }} elevation={1}>
        <Typography variant="h5" gutterBottom>
          Step 1: Create Your First Template Group
        </Typography>
        <List component="ol" sx={{ p: 0, listStyleType: "decimal", pl: 4 }}>
          <ListItem sx={{ display: "list-item", pl: 1, pb: 0 }}>
            <ListItemText primary="Click the Templates button in the top navigation bar" />
          </ListItem>
          <ListItem sx={{ display: "list-item", pl: 1, pb: 0 }}>
            <ListItemText primary="On the templates page, find the Add Group button and click it" />
          </ListItem>
          <ListItem sx={{ display: "list-item", pl: 1, pb: 0 }}>
            <ListItemText primary="A form will appear asking for a Group Label - type a name for your collection (e.g., Pool Equipment, Appliance Repairs, Computer Services)" />
          </ListItem>
          <ListItem sx={{ display: "list-item", pl: 1, pb: 0 }}>
            <ListItemText primary="Click Save or press Enter" />
          </ListItem>
          <ListItem sx={{ display: "list-item", pl: 1, pb: 0 }}>
            <ListItemText primary="Your new group will appear on the page, ready for you to add templates" />
          </ListItem>
        </List>
      </Paper>

      <Paper sx={{ py: 2, pl: 2, mb: 2 }} elevation={1}>
        <Typography variant="h5" gutterBottom>
          Step 2: Add a Template with Placeholders
        </Typography>
        <List component="ol" sx={{ p: 0, listStyleType: "decimal", pl: 4 }}>
          <ListItem sx={{ display: "list-item", pl: 1, pb: 0 }}>
            <ListItemText primary="Find your newly created group and click the Edit button" />
          </ListItem>
          <ListItem sx={{ display: "list-item", pl: 1, pb: 0 }}>
            <ListItemText primary="You'll see a text area with your template text" />
          </ListItem>
          <ListItem sx={{ display: "list-item", pl: 1, pb: 0 }}>
            <ListItemText primary="Start typing your response - for example: Your pool robot has {condition}, and this will require {requirement}." />
          </ListItem>
          <ListItem sx={{ display: "list-item", pl: 1, pb: 0 }}>
            <ListItemText primary="The {condition} and {requirement} parts are placeholders - they're where you'll put specific details later" />
          </ListItem>
          <ListItem sx={{ display: "list-item", pl: 1, pb: 0 }}>
            <ListItemText primary="Click Save when you're done editing the template text" />
          </ListItem>
        </List>
      </Paper>

      <Paper sx={{ py: 2, pl: 2, mb: 2 }} elevation={1}>
        <Typography variant="h5" gutterBottom>
          Step 3: Add Values (Fills) for Your Placeholders
        </Typography>
        <List component="ol" sx={{ p: 0, listStyleType: "decimal", pl: 4 }}>
          <ListItem sx={{ display: "list-item", pl: 1, pb: 0 }}>
            <ListItemText primary="After saving your template, you'll see options to add values for each placeholder" />
          </ListItem>
          <ListItem sx={{ display: "list-item", pl: 1, pb: 0 }}>
            <ListItemText primary="Look for a button labeled Add Value next to each placeholder" />
          </ListItem>
          <ListItem sx={{ display: "list-item", pl: 1, pb: 0 }}>
            <ListItemText primary="Click Add Value for {condition}" />
          </ListItem>
          <ListItem sx={{ display: "list-item", pl: 1, pb: 0 }}>
            <ListItemText primary="Type in a specific condition - for example: not holding a charge" />
          </ListItem>
          <ListItem sx={{ display: "list-item", pl: 1, pb: 0 }}>
            <ListItemText primary="Press Enter or click the save icon" />
          </ListItem>
          <ListItem sx={{ display: "list-item", pl: 1, pb: 0 }}>
            <ListItemText primary="Repeat for {requirement} - add values like battery testing and likely replacement" />
          </ListItem>
          <ListItem sx={{ display: "list-item", pl: 1, pb: 0 }}>
            <ListItemText primary="You can add as many values as you want for each placeholder" />
          </ListItem>
          <ListItem sx={{ display: "list-item", pl: 1, pb: 0 }}>
            <ListItemText primary="Click Save to store all your values" />
          </ListItem>
        </List>
      </Paper>

      <Paper sx={{ py: 2, pl: 2, mb: 2 }} elevation={1}>
        <Typography variant="h5" gutterBottom>
          Step 4: Generate a Quote (Go to Output Page)
        </Typography>
        <List component="ol" sx={{ p: 0, listStyleType: "decimal", pl: 4 }}>
          <ListItem sx={{ display: "list-item", pl: 1, pb: 0 }}>
            <ListItemText primary="Click the Output button in the top navigation bar" />
          </ListItem>
          <ListItem sx={{ display: "list-item", pl: 1, pb: 0 }}>
            <ListItemText primary="You'll see all your template groups listed" />
          </ListItem>
          <ListItem sx={{ display: "list-item", pl: 1, pb: 0 }}>
            <ListItemText primary="For each group you want to include in your quote, check the box next to it" />
          </ListItem>
          <ListItem sx={{ display: "list-item", pl: 1, pb: 0 }}>
            <ListItemText primary="For groups with placeholders:" />
          </ListItem>

          <List component="ul" sx={{ p: 0, listStyleType: "disc", pl: 4 }}>
            <ListItem sx={{ display: "list-item", pl: 1, pb: 0 }}>
              <ListItemText primary="If you added predefined values (steps 3 above): a dropdown menu will appear - click it and select the value you want" />
            </ListItem>
            <ListItem sx={{ display: "list-item", pl: 1, pb: 0 }}>
              <ListItemText primary="If you want to use a custom value: type it directly into the text field" />
            </ListItem>
          </List>

          <ListItem sx={{ display: "list-item", pl: 1, pb: 0 }}>
            <ListItemText primary="Once you've filled in all the values, look for the Copy to Clipboard button" />
          </ListItem>
          <ListItem sx={{ display: "list-item", pl: 1, pb: 0 }}>
            <ListItemText primary="Click it to copy your completed quote" />
          </ListItem>
        </List>
      </Paper>

      <Paper sx={{ py: 2, pl: 2, mb: 2 }} elevation={1}>
        <Typography variant="h5" gutterBottom>
          Step 5: Organize and Manage Your Templates
        </Typography>
        <Typography variant="h6" gutterBottom>
          Reordering groups:
        </Typography>
        <List component="ol" sx={{ p: 0, listStyleType: "decimal", pl: 4 }}>
          <ListItem sx={{ display: "list-item", pl: 1, pb: 0 }}>
            <ListItemText primary="On the Templates page, you'll see drag handles (two horizontal lines) next to each group name" />
          </ListItem>
          <ListItem sx={{ display: "list-item", pl: 1, pb: 0 }}>
            <ListItemText primary="Click and drag to move groups up or down - this changes their order in the output" />
          </ListItem>
        </List>

        <Typography variant="h6" gutterBottom>
          Editing a group:
        </Typography>
        <List component="ol" sx={{ p: 0, listStyleType: "decimal", pl: 4 }}>
          <ListItem sx={{ display: "list-item", pl: 1, pb: 0 }}>
            <ListItemText primary="Click Edit on any group to modify the label or template text" />
          </ListItem>
          <ListItem sx={{ display: "list-item", pl: 1, pb: 0 }}>
            <ListItemText primary="Make your changes and click Save" />
          </ListItem>
        </List>

        <Typography variant="h6" gutterBottom>
          Deleting a group:
        </Typography>
        <List component="ol" sx={{ p: 0, listStyleType: "decimal", pl: 4 }}>
          <ListItem sx={{ display: "list-item", pl: 1, pb: 0 }}>
            <ListItemText primary="Click Delete on any group" />
          </ListItem>
          <ListItem sx={{ display: "list-item", pl: 1, pb: 0 }}>
            <ListItemText primary="You'll get a confirmation prompt - confirm to remove it permanently" />
          </ListItem>
        </List>

        <Typography variant="h6" gutterBottom>
          Exporting your work:
        </Typography>
        <List component="ol" sx={{ p: 0, listStyleType: "decimal", pl: 4 }}>
          <ListItem sx={{ display: "list-item", pl: 1, pb: 0 }}>
            <ListItemText primary="On the Templates page, click Export Templates" />
          </ListItem>
          <ListItem sx={{ display: "list-item", pl: 1, pb: 0 }}>
            <ListItemText primary="This creates a JSON file you can save to your computer" />
          </ListItem>
          <ListItem sx={{ display: "list-item", pl: 1, pb: 0 }}>
            <ListItemText primary="You can email it, save it to cloud storage, or share it however you like" />
          </ListItem>
        </List>

        <Typography variant="h6" gutterBottom>
          Importing templates:
        </Typography>
        <List component="ol" sx={{ p: 0, listStyleType: "decimal", pl: 4 }}>
          <ListItem sx={{ display: "list-item", pl: 1, pb: 0 }}>
            <ListItemText primary="On the Templates page, click Import Templates" />
          </ListItem>
          <ListItem sx={{ display: "list-item", pl: 1, pb: 0 }}>
            <ListItemText primary="Select the JSON file you saved earlier" />
          </ListItem>
          <ListItem sx={{ display: "list-item", pl: 1, pb: 0 }}>
            <ListItemText primary="The templates will be added to your existing collection" />
          </ListItem>
        </List>
      </Paper>

      <Paper sx={{ pt: 2, pl: 2, mb: 0 }} elevation={1}>
        <Typography variant="h5" gutterBottom>
          Step 6: Starting Fresh (Clearing Everything)
        </Typography>
        <Typography variant="h6" gutterBottom>
          To reset the Output page:
        </Typography>
        <List component="ol" sx={{ p: 0, listStyleType: "decimal", pl: 4 }}>
          <ListItem sx={{ display: "list-item", pl: 1, pb: 0 }}>
            <ListItemText primary="On the Output page, click Clear All" />
          </ListItem>
          <ListItem sx={{ display: "list-item", pl: 1, pb: 0 }}>
            <ListItemText primary="This unchecks all template groups and clears all filled values" />
          </ListItem>
          <ListItem sx={{ display: "list-item", pl: 1, pb: 0 }}>
            <ListItemText primary="You can start a new quote from scratch" />
          </ListItem>
        </List>

        <Typography variant="h6" gutterBottom>
          To reset all template data:
        </Typography>
        <List component="ol" sx={{ p: 0, listStyleType: "decimal", pl: 4 }}>
          <ListItem sx={{ display: "list-item", pl: 1, pb: 0 }}>
            <ListItemText primary="On the Templates page, click Clear Templates" />
          </ListItem>
          <ListItem sx={{ display: "list-item", pl: 1, pb: 0 }}>
            <ListItemText primary="You'll get a confirmation prompt - this permanently removes all your template groups" />
          </ListItem>
          <ListItem sx={{ display: "list-item", pl: 1, pb: 2 }}>
            <ListItemText primary="Use this if you want to start completely over with new templates" />
          </ListItem>
        </List>
      </Paper>
    </Box>
  );
}
