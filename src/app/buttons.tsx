"use client";
import { useState } from "react";
import {
  Button,
  ButtonGroup,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

export function Buttons({ areas, categories, habits }) {
  const [selectedArea, setSelectedArea] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedHabit, setSelectedHabit] = useState(null);

  const handleAreaClick = (area) => {
    setSelectedArea(area);
    setSelectedCategory(null); // Reset selected category when changing area
    setSelectedHabit(null); // Reset selected habit when changing area
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSelectedHabit(null); // Reset selected habit when changing category
  };

  const handleHabitClick = (habit) => {
    setSelectedHabit(habit);
  };

  // Determine which level of selection to render based on selected state
  let selectionContent;
  if (!selectedArea) {
    // Render Area Buttons
    selectionContent = (
      <ButtonGroup variant="outlined" aria-label="Basic button group">
        {areas.map((area) => (
          <Button key={area} onClick={() => handleAreaClick(area)}>
            {area}
          </Button>
        ))}
      </ButtonGroup>
    );
  } else if (selectedArea && !selectedCategory) {
    // Render Category Buttons based on selected area
    selectionContent = (
      <div className="mt-4">
        {categories
          .filter((cat) => cat.area === selectedArea)
          .map((cat) => (
            <ButtonGroup
              key={cat.area}
              variant="outlined"
              aria-label="Basic button group"
            >
              {cat.categories.map((category) => (
                <Button
                  key={category}
                  onClick={() => handleCategoryClick(category)}
                >
                  {category}
                </Button>
              ))}
            </ButtonGroup>
          ))}
      </div>
    );
  } else if (selectedCategory && !selectedHabit) {
    // Render Habits Dropdown based on selected category
    selectionContent = (
      <div className="mt-4">
        <FormControl fullWidth variant="outlined">
          <InputLabel id="habits-dropdown-label">Habits</InputLabel>
          <Select
            labelId="habits-dropdown-label"
            id="habits-dropdown"
            value={selectedCategory}
            onChange={(e) => handleHabitClick(e.target.value)}
            label="Habits"
          >
            {habits
              .filter((habit) => habit.category === selectedCategory)
              .map((habit) =>
                habit.habits.map((habit) => (
                  <MenuItem key={habit} value={habit}>
                    {habit}
                  </MenuItem>
                ))
              )}
          </Select>
        </FormControl>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* {selectionContent} */}
      {/* Display selected state */}
      <ButtonGroup variant="outlined" aria-label="Basic button group">
        {areas.map((area) => (
          <Button key={area} onClick={() => handleAreaClick(area)}>
            {area}
          </Button>
        ))}
      </ButtonGroup>
      {selectedArea && (
        <div className="mt-4">
          {categories
            .filter((cat) => cat.area === selectedArea)
            .map((cat) => (
              <ButtonGroup
                key={cat.area}
                variant="outlined"
                aria-label="Basic button group"
              >
                {cat.categories.map((category) => (
                  <Button
                    key={category}
                    onClick={() => handleCategoryClick(category)}
                  >
                    {category}
                  </Button>
                ))}
              </ButtonGroup>
            ))}
        </div>
      )}
      {selectedCategory && (
        <div className="mt-4">
          <FormControl fullWidth variant="outlined">
            <InputLabel id="habits-dropdown-label">Habits</InputLabel>
            <Select
              labelId="habits-dropdown-label"
              id="habits-dropdown"
              value={selectedCategory}
              onChange={(e) => handleHabitClick(e.target.value)}
              label="Habits"
            >
              {habits
                .filter((habit) => habit.category === selectedCategory)
                .map((habit) =>
                  habit.habits.map((habit) => (
                    <MenuItem key={habit} value={habit}>
                      {habit}
                    </MenuItem>
                  ))
                )}
            </Select>
          </FormControl>
        </div>
      )}
    </div>
  );
}
