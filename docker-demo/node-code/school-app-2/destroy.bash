echo stopping containers ...
docker stop students-ms accounts-ms
echo containers stopped !!

echo =======================================

echo removing containers ...
docker rm students-ms accounts-ms
echo containers removed !!

echo =======================================

echo removing images ...
docker rmi students-ms:v1 accounts-ms:v1
echo images removed !!

echo =======================================

echo removing volumes ...
docker volume rm school-app-data
echo volumes removed !!

echo =======================================

echo removing network ...
docker network rm school-app-network
echo network removed !!

echo =======================================
echo CLEANUP COMPLETED
echo =======================================