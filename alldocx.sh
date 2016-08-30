for d in _site/2016/*/*/
do
	cd $d
	for f in ./* 
	do
		echo $f
		~/code/Websites/CH101-008/gendocx.sh $f
	done
	cd ~/code/Websites/CH101-008/
done
