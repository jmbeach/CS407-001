printf "Usage:\n\t./genpdf.sh <to-pdf.pdf>\n"
FILE=$(echo $1 | grep -o week.*.html)
NAME=${FILE%.html}
pandoc $1 -f html -o ./assets/$NAME.pdf --toc

printf "\nCreated $NAME.pdf in assets\n\n"
