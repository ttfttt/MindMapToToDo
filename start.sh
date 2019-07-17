cd client
npm i
cd ..
npm --prefix ./client run build
go build -o remindServer ./server
npm --prefix ./client start & ./remindServer