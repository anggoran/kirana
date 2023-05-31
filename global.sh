packager() {
  cd backend
  rm -rf .venv out
  python3 -m venv .venv
  . .venv/bin/activate
  pip3 install -r requirements.txt
  pyinstaller --windowed --onefile server.py --name "Kirana Server" --specpath out --workpath out/build --distpath out/dist

  cd ../frontend
  rm -rf node_modules package-lock.json out
  npm install
  npm run make
}

"$@"