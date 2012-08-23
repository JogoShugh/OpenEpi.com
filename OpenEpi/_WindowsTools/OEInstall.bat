@ECHO OFF
color f4
IF NOT EXIST "%systemdrive%\Program Files\Epi_Info\epiinfo.exe" GOTO NEXT1 
%systemdrive%\Program Files\Epi_Info\epiinfo.exe  oelink.mnu
GOTO OUT
:NEXT1
IF NOT EXIST "..\Epi_Info\epiinfo.exe" GOTO NEXT2
..\Epi_Info\epiinfo.exe oelink.mnu
GOTO OUT
:NEXT2
IF NOT EXIST "%systemdrive%\Epi_Info\epiinfo.exe"  GOTO NEXT3
%systemdrive%\Epi_Info\epiinfo.exe  oelink.mnu
GOTO OUT
:NEXT3
IF NOT EXIST "\Epi_Info\epiinfo.exe" GOTO NEXT4
\Epi_Info\epiinfo.exe oelink.mnu
GOTO OUT
:NEXT4
@ECHO.
@echo If you have Epi Info installed, it is apparently not in
@echo.
@echo   %systemdrive%\Program Files\Epi_Info   or
@echo   ..\Epi_Info\    or
@echo   %systemdrive%\Epi_Info\   or 
@echo   \Epi_Info   
@echo.
@echo If you have installed Epi Info in another location, you can 
@echo still place links to OpenEpi in the EpiInfo menu by typing
@echo commands in this Command Prompt window as follows:
@echo.
@echo (location of your Epi Info folder)\Epiinfo.exe  OELink.mnu
@echo.
@echo If you do not have Epi Info, just type EXIT 
@echo.
@cmd.exe
:OUT
Exit
