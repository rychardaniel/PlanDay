import Button from "@mui/material/Button";
import AcUnitIcon from "@mui/icons-material/AcUnit";

export function Body() {
    return (
        <div>
            <h2>Body</h2>
            <div>
                <Button variant="contained">Botão do Material UI</Button>
                <AcUnitIcon />
                <h1>Fonte h1</h1>
                <h2>Fonte h2</h2>
                <p>Paragrafo</p>
            </div>
        </div>
    );
}
