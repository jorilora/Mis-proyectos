Dim sh, fs, appDir
Set sh = CreateObject("WScript.Shell")
Set fs = CreateObject("Scripting.FileSystemObject")
appDir = fs.GetParentFolderName(fs.GetParentFolderName(WScript.ScriptFullName))
sh.Run "node " & Chr(34) & appDir & "\backend\dist\index.js" & Chr(34), 0, 0
WScript.Sleep 3000
sh.Run "http://localhost:3000"
