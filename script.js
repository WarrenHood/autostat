window.onload = function(){
	document.getElementById('analyse').onclick = handleData;
	document.getElementById('outit').onclick = updateData;
	document.getElementById('percentilec').onclick = function(){refreshOut();
																			var newa = [];
																			var table = g('displayData');
																			rows = table.getElementsByTagName('tr');
																			for(var row = 1;row < rows.length;row++){
																				var cd = rows[row].getElementsByTagName('td')[0].innerHTML;
																				if(cd == 'Item')continue;
																				for(var c = 0;c < freqOf(cd);c++)newa.push(parseInt(cd));
																			}
																			a = newa;
																var pr = g('percentile').value;
																refreshOut();
																print('P<sub>'+pr+'</sub>: '+p(a,parseInt(pr)));
																		}
}
function g(x){
	return document.getElementById(x);
}
function handleData(){
	clearTable();
	g('displayData').innerHTML += '<tr><td>Item</td><td>Frequency</td><td>Delete Item</td></tr>';
	a = g('ui').value.split(' ');
	a.sort(compareNumbers);
	seen = [];
	for(var i = 0; i < a.length;i++){
		if(count(seen,a[i]) == 0){
			table(a[i]);
			seen.push(a[i]);
		}
	}
	for(var i = 0; i < a.length;i++){
		setFreq(a[i],count(a,a[i]));
	}
}
function refreshOut(){
	g('output').innerHTML = '';
}
function print(x){
	g('output').innerHTML += ''+ x+'<br>';
}
function clearTable(){
	g('displayData').innerHTML = '';
}
function table(x){
	texty = g('displayData').innerHTML;
	texty += '<tr id="data'+x+'">';
	texty += '<td>'+x+'</td><td><input size=8/></td><td class="del" onclick="remove('+x+');">X</td>';
	texty += '</tr>';
	g('displayData').innerHTML = texty;
}
function count(a,b){
	var count = 0;
	for(var i = 0;i<a.length;i++){
		if(a[i] == b)count++;
	}
	return count
}
function freqOf(n){
	return g('data'+n).getElementsByTagName('input')[0].value;
}
function setFreq(n,val){
	g('data'+n).getElementsByTagName('input')[0].value = val;
}
function remove(n){
	clearTable();
	var newa = [];
	for(var i = 0;i<a.length;i++){
		if(a[i] != n) newa.push(a[i]);
	}
	a = newa;
	seen = [];
	for(var i = 0; i < a.length;i++){
		if(count(seen,a[i]) == 0){
			table(a[i]);
			seen.push(a[i]);
		}
	}
	for(var i = 0; i < a.length;i++){
		setFreq(a[i],count(a,a[i]));
	}
}
function updateData(){
	refreshOut();
	var newa = [];
	var table = g('displayData');
	rows = table.getElementsByTagName('tr');
	for(var row = 1;row < rows.length;row++){
		var cd = rows[row].getElementsByTagName('td')[0].innerHTML;
		if(cd == 'Item')continue;
		for(var c = 0;c < freqOf(cd);c++)newa.push(parseInt(cd));
	}
	a = newa;
	print('Sorted in ascending order: ');
	print(a);
	print('Mean: '+mean(a));
	print('Range: '+ range(a));
	print('Median: '+p(a,50));
	print('Lower-Quartile: '+p(a,25));
	print('Upper-Quartile: '+p(a,75));
	print('Mode: '+ mode(a) );
}
function mean(d){
	sum = 0;
	for(var x = 0;x<d.length;x++)sum += parseInt(d[x]);
	return ''+sum+' / ' + d.length + ' = ' + sum/d.length;
}
function p(d,percent){
	var pos = parseFloat(percent)*(1+d.length)/100 - 1;
	return d[Math.floor(pos)] + (pos - Math.floor(pos))*(d[Math.ceil(pos)] - d[Math.floor(pos)]);
}
function range(d){
	return d[d.length-1] +'-'+ d[0] + ' = '+ (parseInt(d[d.length-1]) - parseInt(d[0]));
}
function mode(d){
	var max = 0;
	var modes = [];
	var m = 0;
	for(var i = 0;i<d.length;i++)if(count(d,parseFloat(d[i])) > max){
		max = count(d,parseFloat(d[i]));
		m = d[i];
	}
	for(var n = 0;n<d.length;n++)if(count(d,parseFloat(d[n])) == max && count(modes,parseFloat(d[n])) == 0)modes.push(d[n]);
	s = modes.join(' and ')
	return s;
}
function compareNumbers(a, b)
{
    return a - b;
}