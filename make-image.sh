cat title.txt | imgmk -font-path="/Library/Fonts/Trattatello.ttf" -name="$1" -width=500 -height=500
convert $1 $1.jpg
