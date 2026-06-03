function mostrarToast(mensaje, tipo = "info") {
    const toast = document.getElementById('toast');

    toast.textContent = mensaje;

    // reset de clases
    toast.className = "toast";

    // tipo
    if (tipo === "success") {
        toast.classList.add("toast-success");
    } else if (tipo === "error") {
        toast.classList.add("toast-error");
    } else {
        toast.classList.add("toast-info");
    }

    toast.classList.remove("hidden");

    setTimeout(() => {
        toast.classList.add("hidden");
    }, 5000);
}