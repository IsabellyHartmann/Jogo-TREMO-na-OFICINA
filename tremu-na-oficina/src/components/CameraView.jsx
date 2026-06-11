import React, { useRef, useEffect, useState } from 'react';

export default function CameraView({ letraAlvo, onFrame }) {
    const videoRef = useRef(null);
    const [status, setStatus] = useState("A iniciar câmara...");

    useEffect(() => {
        let ativo = true;
        let idAnimacao;

        async function iniciarVideo() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { width: 400, height: 300, facingMode: "user" }
                });
                if (videoRef.current && ativo) {
                    videoRef.current.srcObject = stream;
                    setStatus(`Faça o gesto para a letra: ${letraAlvo}`);

                    // Inicia o loop contínuo de captura e análise de imagem
                    const loop = () => {
                        if (videoRef.current) {
                            onFrame(videoRef.current);
                        }
                        idAnimacao = requestAnimationFrame(loop);
                    };
                    loop();
                }
            } catch (err) {
                setStatus("Erro: Permita o acesso à câmara nas definições.");
            }
        }

        iniciarVideo();

        return () => {
            ativo = false;
            cancelAnimationFrame(idAnimacao);
        };
    }, [letraAlvo, onFrame]);

    return (
        <div>
            <p style={{ fontWeight: 'bold', margin: '8px 0' }}>{status}</p>
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                width="400"
                height="300"
                style={{ borderRadius: '12px', transform: 'scaleX(-1)', border: '4px solid #333', backgroundColor: '#000' }}
            />
        </div>
    );
}