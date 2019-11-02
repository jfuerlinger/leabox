ressourceGroup=leabox

az group create --name leabox --location westeurope

az provider register --namespace Microsoft.EventGrid
az provider show --namespace Microsoft.EventGrid --query "registrationState"

topicname=leabox

az eventgrid topic create --name $topicname -l westeurope -g $ressourceGroup

sitename=leabox-eventdebugger

az group deployment create --resource-group $ressourceGroup --template-uri "https://raw.githubusercontent.com/Azure-Samples/azure-event-grid-viewer/master/azuredeploy.json"  --parameters siteName=$sitename hostingPlanName=viewerhost 
  
endpoint=https://$sitename.azurewebsites.net/api/updates

subscription=$(az account show --query id --output tsv)

az eventgrid event-subscription create --source-resource-id "/subscriptions/$subscription/$ressourceGroup/leabox/providers/Microsoft.EventGrid/topics/$topicname" --name eventDebuggerSubscription --endpoint $endpoint

endpoint=$(az eventgrid topic show --name $topicname -g $ressourceGroup --query "endpoint" --output tsv)
key=$(az eventgrid topic key list --name $topicname -g $ressourceGroup --query "key1" --output tsv)

event='[ {"id": "'"$RANDOM"'", "eventType": "recordInserted", "subject": "myapp/vehicles/motorcycles", "eventTime": "'`date +%Y-%m-%dT%H:%M:%S%z`'", "data":{ "make": "Ducati", "model": "Monster"},"dataVersion": "1.0"} ]'
