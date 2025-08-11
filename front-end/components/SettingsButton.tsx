import IconButton from "@mui/material/IconButton";
import SettingsIcon from "@mui/icons-material/Settings";

type Props = {
    onClick?: () => void;
};

export default function SettingsButton({ onClick }: Props) {
    return (
        <IconButton size="small" color="primary" onClick={onClick}>
            <SettingsIcon />
        </IconButton>
    );
}
