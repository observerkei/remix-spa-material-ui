import { useColorScheme } from '@mui/material/styles';
import { CustomWidthTooltip } from '../Contact/ContactList';

function ModeSwitcher() {
  const { mode, setMode } = useColorScheme();
  if (!mode) {
    return null;
  }

  return (
    <>
      <CustomWidthTooltip title={"Change Theme"} placement={'left'} arrow>
        <select
          value={mode}
          onChange={(event) => {
            setMode(event.target.value as string);
            // For TypeScript, cast `event.target.value as 'light' | 'dark' | 'system'`:
          }}
        >
          <option value="system">System</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </CustomWidthTooltip>

    </>
  );
}

export default ModeSwitcher;