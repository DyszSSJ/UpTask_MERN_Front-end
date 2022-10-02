export const formatearFecha = (fecha) => {
    const fechaFormateada = new Date(fecha.split("T")[0].split("-"));
    const dia = fechaFormateada.getDate();
    const mes = fechaFormateada.getMonth() + 1;
    const year = fechaFormateada.getFullYear();
    return `${dia}/${mes}/${year}`; 
}