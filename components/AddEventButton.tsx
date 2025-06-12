import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";

type Props = {
    onClick?: () => void;
};

export default function AddEventButton({ onClick }: Props) {
    return (
        <IconButton size="small" color="primary" onClick={onClick}>
            <AddIcon />
        </IconButton>
    );
}
