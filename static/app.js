async function speak() {
    const text = document.getElementById("text").value;

    const res = await fetch("/speak", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ text })
    });

    if (!res.ok) {
        const err = await res.json();
        alert(err.error);
        return;
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    const player = document.getElementById("player");
    player.src = url;

    player.play().catch(e => console.log(e));
}
