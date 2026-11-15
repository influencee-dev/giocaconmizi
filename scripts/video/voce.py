# La voce del video: una frase per scena, con l'API di OpenAI (la chiave la mette il proxy).
import json, subprocess, sys
VOCE = sys.argv[1] if len(sys.argv) > 1 else 'shimmer'
ISTR = ("Sei una mamma italiana che parla con un'altra mamma che gestisce una piccola attività per bambini. "
        "Tono caldo, empatico e rassicurante, con un sorriso nella voce. Parla in modo naturale e colloquiale, non da spot pubblicitario: "
        "ritmo calmo, piccole pause dopo le virgole, intonazione che sale leggermente nelle domande. Accento italiano neutro, pronuncia italiana perfetta.")
for i, s in enumerate(json.load(open('testi.json'))):
    body = json.dumps({"model": "gpt-4o-mini-tts", "voice": VOCE, "input": s, "instructions": ISTR, "response_format": "wav"})
    subprocess.run(["curl", "-sS", "-m", "90", "https://api.openai.com/v1/audio/speech", "-H", "Authorization: Bearer proxy-injected",
                    "-H", "Content-Type: application/json", "-d", body, "-o", f"voce/{i}.wav"], check=True)
    d = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f"voce/{i}.wav"], capture_output=True, text=True).stdout.strip()
    print(i, d)
