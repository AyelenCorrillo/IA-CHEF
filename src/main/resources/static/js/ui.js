function mostrarToast(mensaje, tipo = "info") {
    const toast = document.getElementById('toast');

    toast.textContent = mensaje;

    toast.classList.remove(
        "toast-success",
        "toast-error",
        "toast-info",
        "hidden"
    );

    // tipo
    if (tipo === "success") {
        toast.classList.add("toast-success");
    } else if (tipo === "error") {
        toast.classList.add("toast-error");
    } else {
        toast.classList.add("toast-info");
    }

    toast.classList.remove("hidden");

    clearTimeout(toast.timeoutId);

    toast.timeoutId = setTimeout(() => {
        toast.classList.add("hidden");
    }, 3000);
}