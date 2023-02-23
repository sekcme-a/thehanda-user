import {useEffect, useState} from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import Checkbox from '@mui/material/Checkbox';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import ListItemText from '@mui/material/ListItemText';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(item, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(item) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function MultipleSelectCheck({ title, items, setSelectedItems, selectedItems }) {
  const theme = useTheme();
  const [personName, setPersonName] = useState([]);

  useEffect(() => {
    let value = []
    if (selectedItems) {
      for (let i = 0; i < selectedItems.length; i++) {
        for (let j = 0; j < items.length; j++) {
          if (selectedItems[i] === items[j].id)
            value.push(items[j].name)
        }
      }
      const temp = {
        target: {
          value: value
        }
      }
      handleChange(temp)
    }
  },[])

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
    console.log(typeof value === 'string' ? value.split(',') : value,)
    setSelectedItems(nameToId(event.target.value))
  };

  const nameToId = (list) => {
    let value = []
    for (let i = 0; i < list.length; i++){
      for (let j = 0; j < items.length; j++){
        if(list[i]===items[j].name)
          value.push(items[j].id)
      }
    }
    return value
  }

  return (
    <div> 
      <FormControl sx={{ m: 1}} fullWidth>
        <InputLabel id="demo-multiple-chip-label">{title}</InputLabel>
        <Select
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          multiple
          value={personName}
          onChange={handleChange}
          input={<OutlinedInput id="select-multiple-chip"  label={title}/>}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) =>(
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {items.map((item) => {
            console.log(personName)
            console.log(item)
            console.log(personName.indexOf(item) > -1)
          })}
          {items.map((item) => (
            <MenuItem key={item.id} value={item.name}>
              <Checkbox checked={personName.indexOf(item.name) > -1} />
              <ListItemText primary={item.name} />
            </MenuItem>
          ))}
          {/* {items.map((item) => (
            <MenuItem
              key={item.id}
              value={item}
              style={getStyles(item, personName, theme)}
              
            >
              {item.name}
            </MenuItem>
          ))} */}
        </Select>
      </FormControl>
    </div>
  );
}
