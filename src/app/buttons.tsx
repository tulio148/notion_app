"use client";
import {
  Button,
  ButtonGroup,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useHabit } from "./context";

export function Buttons({ areas, categories, habits }) {
  const {
    selectedArea,
    selectedCategory,
    selectedHabit,
    setSelectedArea,
    setSelectedCategory,
    setSelectedHabit,
  } = useHabit();
  const handleAreaClick = (area) => {
    setSelectedArea(area);
    setSelectedCategory(null);
    setSelectedHabit(null);
  };
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSelectedHabit(null);
  };

  const handleHabitClick = (habit) => {
    setSelectedHabit(habit);
  };

  return (
    <div className="">
      <ButtonGroup variant="text" aria-label="Basic button group">
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
                variant="text"
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
          <FormControl fullWidth>
            <InputLabel id="habits-dropdown-label">Habits</InputLabel>
            <Select
              labelId="habits-dropdown-label"
              id="habits-dropdown"
              value={selectedHabit ?? ""}
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
