/* How to use
To include JEI in a .md page: <div class="jei (name)" data-(name)="value"></div>
    Two classes, "jei" and the name of the recipe, as registred below
    All data are optional
    Data relative to the informations in the text box:
        data-duration: Number in quotes
        data-usage: Number in quotes
        data-generation: Number in quotes
        data-mincomput: Number in quotes, "Min. Computation"
        data-temp: Number in quotes
        data-coil: String
        data-e2start: Number in quotes, "Energy to Start"
        data-note: String, an additional note
            "Requires Research"
            "Requires Cleanroom"
            "Requires Sterile Cleanroom"
            "Fluid Blocks Around"
    Other data:
        data-tier: String, the energy tier (from UlV to MAX)
        data-slotn: String, "itemName quantity"
            replace n with the slot "id" (eg. data-slot1 for the first slot)
            itemName: the registry name, not the display name (eg. fluid.chlorine)
            quantity: optional, either a slot size (eg. 2, 64) or a fluid quantity (eg. 2B, 144mB)
    Since data-note does not handle colors, the Air Scrubber recipe is not fully displayable but is completely useless anyway

To registry a new item: add a new element in the pool variable
    The property name must be the same as the texture name. You may need to use quotes
    displayName, mod and url are not optional

To registry a new recipe type: It will start by "document.querySelectorAll(name)", see how others are done
    Name: String, a name chosen for the recipe type
    Set the height and width, 1px in game = 2px here
    AddText(recipe, height) to add the text on the bottom
        height: Number, optional if the max number of text lines in the box is 3, should be equal to recipe.style.height (without px) - 20*(max number of lines) - 17
    setArrow(recipe, top, left, arrowimg, pagepath)
        top, left: Number, the position in px of the arrow
            if centered, left should be equal to (recipe.style.width-3-arrowWidth)/2
                arrowWidth: 40 for arrows, 36 for flames etc
        arrowimg: String, the file of the arrow image (found in assets/image/progress_bar)
        pagepath: String, the path after StarT-docs/ ending with the page where the arrow should send when clicked
    setSlot(recipe, slotn, top, left, slotimg, overlayimg) to add a new slot
        slotn: Number, the "id" of the slot, should be in a logical order
        top, left: Number, the position in px of the slot
        slotimg: String, the file of the slot image (found in assets/image/slot)
        overlayimg: String, the file of the overlay image (found in assets/image/slot)
    

    Be pixel precise!
*/





//Normally all progress bar texture for GregTech recipes are in the folder. Some are in two parts (hammer, lathe, assembly line) or three parts (research station)

const tier = ["ULV", "LV", "MV", "HV", "EV", "IV", "LuV", "ZPM", "UV", "UHV", "UEV", "UIV", "UXV", "OpV", "MAX"];
const color = ["rgb(84,84,84)", "rgb(168,168,168)", "rgb(84,252,252)", "rgb(252,168,0)", "rgb(168,0,168)", "rgb(84,84,252)", "rgb(252,84,252)", "rgb(252,84,84)", "rgb(0,168,168)", "rgb(168,0,0)", "rgb(84,252,84)", "rgb(0,168,0)", "rgb(252,252,84)", "rgb(84,84,252)", "rgb(252,84,84)"];
const path = location.pathname.split("/")[1] === "trulyno" ? "trulyno/StarT-docs/" : "StarT-docs/"

//Registry of items and fluid. Don't forget to add the texture to, if the item is called "name", the texture must be called "name.png"
//Currently, only handle animations frame by frame, without "interpolate":true
var pool = {
    template: {
        displayName: "", //Name to Display ; either a string or an array such ass array[0] = text to display, array[1] = rgb color ; eg. ["Nether Star", "rgb(252, 252, 84)"]
        chem: "", //Chemical formula (optional) ; use ^ or _ to convert following numbers into superscript or subscript (eg. H_2O, Pu^241)
        state: "", //Liquid, Gaseous or Plasma (optional)
        lore: [""], //Other text displayed ; array, where each element is similar to displayName (either a string or another array with two element)
        temp: "", //Temperature with unit (optional) ; Will mess up the tooltip if temp is defined while chem AND state are undefined
        mod: "", //Self explanatory
        url: "", //The part after StarT-docs/
        animated: true, //Whether the texture is animated, only if the item has a .mcmeta file (optional, false by default)
    },

    missing_texture: {//displayed when an item is not registred here
        displayName: "Missing Data",
        mod: "Unknown",
        url: "Contributing to This Wiki"
    },

    bone: {
        displayName: "Bone",
        mod: "Minecraft",
        url: "Gameplay/Lines/Chemical Lines/Plastics & Rubbers/Plastics/Polyethylene"
    },

    apple: {
        displayName: "Apple",
        chem: "SeEd_4",
        state: "Ripe",
        temp: "293 K",
        mod: "Minecraft",
        url: "Challenges"
    },

    "fluid.chlorine": {
        displayName: "Chlorine Gas",
        chem: "Cl",
        state: "Gaseous",
        temp: "293 K",
        mod: "GregTech",
        url: "Contributing to This Wiki",
        animated: true,
    },

    quantum_star: {
        displayName: "Quantum Star",
        lore: ["Improved Nether Star"],
        mod: "GregTech",
        url: "Contributing to This Wiki",
        animated: true,
    },

    wetware_processor: {
        displayName: "Wetware Processor",
        lore: ["You have a feeling like it's watching you", ["LuV-Tier Circuit", "rgb(168, 0, 0)"]],
        mod: "GregTech",
        url: "Contributing to This Wiki",
        animated: true,
    },

    opv_electric_motor: {
        displayName: "OpV Electric Motor",
        mod: "GregTech",
        url: "Contributing to This Wiki",
        animated: false,
    },
};

const material = {
    cobalt: {
        displayName: "Cobalt",
        chem: "Co",
        temp: "1768 K",
        mod: "GregTech",
        url: "Gameplay/Materials/Elements/Cobalt",
        color: 5263610,
        set: "metallic",
    }
}

for (mat in material) {
    pool[mat + "_ingot"] = {
        displayName: material[mat].displayName + " Ingot",
        chem: material[mat].chem,
        mod: material[mat].mod,
        url: "Gameplay/Item Types/Ingot",
        color: material[mat].color,
        set: material[mat].set,
        type:"ingot",
    }
}

//Registry of recipe types
//It's scalled x2, so one pixel ingame is two pixels here
//Be pixel-precise please!
document.querySelectorAll(".abs").forEach(recipe => {
    recipe.style.height = "306px";
    recipe.style.width = "344px";
    addText(recipe, 169);
    setArrow(recipe, 62, 146, "progress_bar_arrow.png", "right", "Gameplay/Recipe Types/Alloy Blast Smelter");

    setSlot(recipe, 1, 10, 10, "slot.png", "furnace_overlay_1.png");
    setSlot(recipe, 2, 10, 46, "slot.png", "furnace_overlay_1.png");
    setSlot(recipe, 3, 10, 82, "slot.png", "furnace_overlay_1.png");
    setSlot(recipe, 4, 46, 10, "slot.png", "furnace_overlay_1.png");
    setSlot(recipe, 5, 46, 46, "slot.png", "furnace_overlay_1.png");
    setSlot(recipe, 6, 46, 82, "slot.png", "furnace_overlay_1.png");
    setSlot(recipe, 7, 82, 10, "slot.png", "furnace_overlay_1.png");
    setSlot(recipe, 8, 82, 46, "slot.png", "furnace_overlay_1.png");
    setSlot(recipe, 9, 82, 82, "slot.png", "furnace_overlay_1.png");
    setSlot(recipe, 10, 118, 10, "fluid_slot.png", "furnace_overlay_2.png");
    setSlot(recipe, 11, 118, 46, "fluid_slot.png", "furnace_overlay_2.png");
    setSlot(recipe, 12, 118, 82, "fluid_slot.png", "furnace_overlay_2.png");

    setSlot(recipe, 13, 64, 250, "fluid_slot.png", "furnace_overlay_2.png");

    setSlot(recipe, 14, 212, 280, "slot.png");
});

document.querySelectorAll(".alloy").forEach(recipe => {
    recipe.style.height = "138px";
    recipe.style.width = "316px";
    addText(recipe);
    setArrow(recipe, 8, 132, "progress_bar_arrow.png", "right", "Gameplay/Recipe Types/Alloy Smelter");

    setSlot(recipe, 1, 10, 32, "slot.png", "furnace_overlay_1.png");
    setSlot(recipe, 2, 10, 68, "slot.png", "furnace_overlay_1.png");

    setSlot(recipe, 3, 10, 218, "slot.png");
});

document.querySelectorAll(".arc").forEach(recipe => {
    recipe.style.height = "210px";
    recipe.style.width = "344px";
    addText(recipe);
    setArrow(recipe, 44, 146, "progress_bar_arc_furnace.png", "right", "Gameplay/Recipe Types/Arc Furnace");

    setSlot(recipe, 1, 28, 46, "slot.png");
    setSlot(recipe, 2, 64, 46, "fluid_slot.png");

    setSlot(recipe, 3, 10, 214, "slot.png");
    setSlot(recipe, 4, 10, 250, "slot.png");
    setSlot(recipe, 5, 10, 286, "slot.png");
    setSlot(recipe, 6, 46, 214, "slot.png");
    setSlot(recipe, 7, 82, 214, "fluid_slot.png");
});

document.querySelectorAll(".assembler").forEach(recipe => {
    recipe.style.height = "246px";
    recipe.style.width = "344px";
    addText(recipe);
    setArrow(recipe, 62, 146, "progress_bar_assembler.png", "right", "Gameplay/Recipe Types/Assembler");

    setSlot(recipe, 1, 10, 10, "slot.png", "circuit_overlay.png");
    setSlot(recipe, 2, 10, 46, "slot.png", "circuit_overlay.png");
    setSlot(recipe, 3, 10, 82, "slot.png", "circuit_overlay.png");
    setSlot(recipe, 4, 46, 10, "slot.png", "circuit_overlay.png");
    setSlot(recipe, 5, 46, 46, "slot.png", "circuit_overlay.png");
    setSlot(recipe, 6, 46, 82, "slot.png", "circuit_overlay.png");
    setSlot(recipe, 7, 82, 10, "slot.png", "circuit_overlay.png");
    setSlot(recipe, 8, 82, 46, "slot.png", "circuit_overlay.png");
    setSlot(recipe, 9, 82, 82, "slot.png", "circuit_overlay.png");
    setSlot(recipe, 10, 118, 10, "fluid_slot.png");

    setSlot(recipe, 11, 64, 250, "slot.png");
});

document.querySelectorAll(".assline").forEach(recipe => {
    recipe.style.height = "266px";
    recipe.style.width = "324px";
    addText(recipe, 169);
    setArrow(recipe, 0, 0, "", "assline", "Gameplay/Recipe Types/Assembly Line");

    setSlot(recipe, 1, 10, 10, "slot.png");
    setSlot(recipe, 2, 10, 46, "slot.png");
    setSlot(recipe, 3, 10, 82, "slot.png");
    setSlot(recipe, 4, 10, 118, "slot.png");
    setSlot(recipe, 5, 46, 10, "slot.png");
    setSlot(recipe, 6, 46, 46, "slot.png");
    setSlot(recipe, 7, 46, 82, "slot.png");
    setSlot(recipe, 8, 46, 118, "slot.png");
    setSlot(recipe, 9, 82, 10, "slot.png");
    setSlot(recipe, 10, 82, 46, "slot.png");
    setSlot(recipe, 11, 82, 82, "slot.png");
    setSlot(recipe, 12, 82, 118, "slot.png");
    setSlot(recipe, 13, 118, 10, "slot.png");
    setSlot(recipe, 14, 118, 46, "slot.png");
    setSlot(recipe, 15, 118, 82, "slot.png");
    setSlot(recipe, 16, 118, 118, "slot.png");

    setSlot(recipe, 17, 10, 188, "fluid_slot.png");
    setSlot(recipe, 18, 46, 188, "fluid_slot.png");
    setSlot(recipe, 19, 82, 188, "fluid_slot.png");
    setSlot(recipe, 20, 118, 188, "fluid_slot.png");

    setSlot(recipe, 21, 10, 262, "slot.png");

    setSlot(recipe, 22, 82, 262, "slot.png", "data_orb_overlay.png");
});

document.querySelectorAll(".autoclave").forEach(recipe => {
    recipe.style.height = "174px";
    recipe.style.width = "316px";
    addText(recipe);
    setArrow(recipe, 26, 132, "progress_bar_crystallization.png", "right", "Gameplay/Recipe Types/Autoclave");

    setSlot(recipe, 1, 10, 32, "slot.png", "dust_overlay.png");
    setSlot(recipe, 2, 10, 68, "slot.png", "dust_overlay.png");
    setSlot(recipe, 3, 46, 32, "fluid_slot.png");
    
    setSlot(recipe, 1, 10, 200, "slot.png", "crystal_overlay.png");
    setSlot(recipe, 2, 10, 236, "slot.png", "crystal_overlay.png");
    setSlot(recipe, 3, 46, 200, "fluid_slot.png");
});

//Bacteria breeding
//Bacteria harvesting
//Bacteria mutating
//Barrel
//Bedrock fluid diagram

document.querySelectorAll(".bender").forEach(recipe => {
    recipe.style.height = "138px";
    recipe.style.width = "316px";
    addText(recipe);
    setArrow(recipe, 8, 132, "progress_bar_bending.png", "right", "Gameplay/Recipe Types/Bender");

    setSlot(recipe, 1, 10, 32, "slot.png", "bender_overlay.png");
    setSlot(recipe, 2, 10, 68, "slot.png", "int_circuit_overlay.png");

    setSlot(recipe, 3, 10, 218, "slot.png");
});

document.querySelectorAll(".sbf").forEach(recipe => {
    recipe.style.height = "138px";
    recipe.style.width = "344px";
    addText(recipe);
    setArrow(recipe, 10, 148, "progress_bar_default.png", "flame", "Gameplay/Recipe Types/Solid Blast Furnace");

    setSlot(recipe, 1, 10, 10, "slot.png");
    setSlot(recipe, 2, 10, 46, "slot.png");
    setSlot(recipe, 3, 10, 82, "slot.png");

    setSlot(recipe, 4, 10, 214, "slot.png");
    setSlot(recipe, 5, 10, 250, "slot.png");
    setSlot(recipe, 6, 10, 286, "slot.png");
});

document.querySelectorAll(".brewery").forEach(recipe => {
    recipe.style.height = "174px";
    recipe.style.width = "316px";
    addText(recipe);
    setArrow(recipe, 26, 132, "progress_bar_arrow_multiple.png", "right", "Gameplay/Recipe Types/Brewery");

    setSlot(recipe, 1, 10, 68, "slot.png", "brewer_overlay.png");
    setSlot(recipe, 2, 46, 68, "fluid_slot.png");

    setSlot(recipe, 3, 28, 200, "fluid_slot.png");
});

document.querySelectorAll(".canner").forEach(recipe => {
    recipe.style.height = "174px";
    recipe.style.width = "316px";
    addText(recipe);
    setArrow(recipe, 26, 132, "progress_bar_canner.png", "right", "Gameplay/Recipe Types/Canner");

    setSlot(recipe, 1, 10, 32, "slot.png", "canner_overlay.png");
    setSlot(recipe, 2, 10, 68, "slot.png", "canister_overlay.png");
    setSlot(recipe, 3, 46, 32, "fluid_slot.png", "dark_canister_overlay.png");

    setSlot(recipe, 4, 10, 200, "slot.png", "canister_overlay.png");
    setSlot(recipe, 5, 10, 236, "slot.png", "canister_overlay.png");
    setSlot(recipe, 6, 46, 200, "fluid_slot.png", "dark_canister_overlay.png");
});

document.querySelectorAll(".centrifuge").forEach(recipe => {
    recipe.style.height = "246px";
    recipe.style.width = "344px";
    addText(recipe);
    setArrow(recipe, 62, 146, "progress_bar_extract.png", "right", "Gameplay/Recipe Types/Centrifuge");

    setSlot(recipe, 1, 46, 28, "slot.png", "extractor_overlay.png");
    setSlot(recipe, 2, 46, 64, "slot.png", "canister_overlay.png");
    setSlot(recipe, 3, 82, 28, "fluid_slot.png", "centrifuge_overlay.png");

    setSlot(recipe, 4, 10, 214, "slot.png");
    setSlot(recipe, 5, 10, 250, "slot.png");
    setSlot(recipe, 6, 10, 286, "slot.png");
    setSlot(recipe, 7, 46, 214, "slot.png");
    setSlot(recipe, 8, 46, 250, "slot.png");
    setSlot(recipe, 9, 46, 286, "slot.png");
    setSlot(recipe, 10, 82, 214, "fluid_slot.png");
    setSlot(recipe, 11, 82, 250, "fluid_slot.png");
    setSlot(recipe, 12, 82, 286, "fluid_slot.png");
    setSlot(recipe, 13, 118, 214, "fluid_slot.png");
    setSlot(recipe, 14, 118, 250, "fluid_slot.png");
    setSlot(recipe, 15, 118, 286, "fluid_slot.png");
});

document.querySelectorAll(".bath").forEach(recipe => {
    recipe.style.height = "210px";
    recipe.style.width = "344px";
    addText(recipe);
    setArrow(recipe, 44, 146, "progress_bar_mixer.png", "right", "Gameplay/Recipe Types/Chemical Bath");

    setSlot(recipe, 1, 28, 46, "slot.png", "brewer_overlay.png");
    setSlot(recipe, 2, 64, 46, "fluid_slot.png");

    setSlot(recipe, 3, 10, 214, "slot.png", "dust_overlay.png");
    setSlot(recipe, 4, 10, 250, "slot.png", "dust_overlay.png");
    setSlot(recipe, 5, 10, 286, "slot.png", "dust_overlay.png");
    setSlot(recipe, 6, 46, 214, "slot.png", "dust_overlay.png");
    setSlot(recipe, 7, 46, 250, "slot.png", "dust_overlay.png");
    setSlot(recipe, 8, 46, 286, "slot.png", "dust_overlay.png");
    setSlot(recipe, 9, 82, 214, "fluid_slot.png");
});

document.querySelectorAll(".plant").forEach(recipe => {
    recipe.style.height = "318px";
    recipe.style.width = "344px";
    addText(recipe);
    setArrow(recipe, 100, 148, "progress_bar_default.png", "flame", "Gameplay/Recipe Types/Chemical plant");

    setSlot(recipe, 1, 10, 10, "slot.png");
    setSlot(recipe, 2, 10, 46, "slot.png");
    setSlot(recipe, 3, 10, 82, "slot.png");
    setSlot(recipe, 4, 46, 10, "slot.png");
    setSlot(recipe, 5, 46, 46, "slot.png");
    setSlot(recipe, 6, 46, 82, "slot.png");
    setSlot(recipe, 7, 82, 10, "slot.png");
    setSlot(recipe, 8, 82, 46, "slot.png");
    setSlot(recipe, 9, 82, 82, "slot.png");
    setSlot(recipe, 10, 118, 10, "fluid_slot.png");
    setSlot(recipe, 11, 118, 46, "fluid_slot.png");
    setSlot(recipe, 12, 118, 82, "fluid_slot.png");
    setSlot(recipe, 13, 154, 10, "fluid_slot.png");
    setSlot(recipe, 14, 154, 46, "fluid_slot.png");
    setSlot(recipe, 15, 154, 82, "fluid_slot.png");
    setSlot(recipe, 16, 190, 10, "fluid_slot.png");
    setSlot(recipe, 17, 190, 46, "fluid_slot.png");
    setSlot(recipe, 18, 190, 82, "fluid_slot.png");

    setSlot(recipe, 1, 10, 214, "slot.png");
    setSlot(recipe, 2, 10, 250, "slot.png");
    setSlot(recipe, 3, 10, 286, "slot.png");
    setSlot(recipe, 4, 46, 214, "slot.png");
    setSlot(recipe, 5, 46, 250, "slot.png");
    setSlot(recipe, 6, 46, 286, "slot.png");
    setSlot(recipe, 7, 82, 214, "slot.png");
    setSlot(recipe, 8, 82, 250, "slot.png");
    setSlot(recipe, 9, 82, 286, "slot.png");
    setSlot(recipe, 10, 118, 214, "fluid_slot.png");
    setSlot(recipe, 11, 118, 250, "fluid_slot.png");
    setSlot(recipe, 12, 118, 286, "fluid_slot.png");
    setSlot(recipe, 13, 154, 214, "fluid_slot.png");
    setSlot(recipe, 14, 154, 250, "fluid_slot.png");
    setSlot(recipe, 15, 154, 286, "fluid_slot.png");
    setSlot(recipe, 16, 190, 214, "fluid_slot.png");
    setSlot(recipe, 17, 190, 250, "fluid_slot.png");
    setSlot(recipe, 18, 190, 286, "fluid_slot.png");
});

document.querySelectorAll(".chem").forEach(recipe => {
    recipe.style.height = "194px";
    recipe.style.width = "344px";
    addText(recipe, 97);
    setArrow(recipe, 26, 146, "progress_bar_arrow_multiple.png", "right", "Gameplay/Recipe Types/Chemical Reactor");

    setSlot(recipe, 1, 10, 10, "slot.png", "molecular_overlay_1.png");
    setSlot(recipe, 2, 10, 46, "slot.png", "molecular_overlay_2.png");
    setSlot(recipe, 3, 46, 10, "fluid_slot.png", "molecular_overlay_3.png");
    setSlot(recipe, 4, 46, 46, "fluid_slot.png", "molecular_overlay_3.png");
    setSlot(recipe, 5, 46, 82, "fluid_slot.png", "molecular_overlay_4.png");

    setSlot(recipe, 6, 10, 232, "slot.png", "vial_overlay_1.png");
    setSlot(recipe, 7, 10, 268, "slot.png", "vial_overlay_1.png");
    setSlot(recipe, 8, 46, 232, "fluid_slot.png", "vial_overlay_2.png");
    setSlot(recipe, 9, 46, 268, "fluid_slot.png", "vial_overlay_2.png");
});

document.querySelectorAll(".circuit").forEach(recipe => {
    recipe.style.height = "230px";
    recipe.style.width = "344px";
    addText(recipe, 133);
    setArrow(recipe, 44, 146, "progress_bar_circuit_assembler.png", "right", "Gameplay/Recipe Types/Circuit Assembler");

    setSlot(recipe, 1, 10, 10, "slot.png", "circuit_overlay.png");
    setSlot(recipe, 2, 10, 46, "slot.png", "circuit_overlay.png");
    setSlot(recipe, 3, 10, 82, "slot.png", "circuit_overlay.png");
    setSlot(recipe, 4, 46, 10, "slot.png", "circuit_overlay.png");
    setSlot(recipe, 5, 46, 46, "slot.png", "circuit_overlay.png");
    setSlot(recipe, 6, 46, 82, "slot.png", "circuit_overlay.png");
    setSlot(recipe, 7, 82, 10, "fluid_slot.png");

    setSlot(recipe, 8, 46, 250, "slot.png");
});

document.querySelectorAll(".cobbleworks").forEach(recipe => {
    recipe.style.height = "174px";
    recipe.style.width = "316px";
    addText(recipe);
    setArrow(recipe, 28, 134, "progress_bar_default.png", "flame", "Gameplay/Recipe Types/Large Sieve Cobbleworks");

    setSlot(recipe, 1, 10, 32, "slot.png");
    setSlot(recipe, 2, 46, 32, "fluid_slot.png");
    setSlot(recipe, 3, 46, 68, "fluid_slot.png");

    setSlot(recipe, 4, 28, 218, "slot.png");
});

document.querySelectorAll(".coke").forEach(recipe => {
    recipe.style.height = "134px";
    recipe.style.width = "316px";
    addText(recipe, 97);
    setArrow(recipe, 26, 132, "progress_bar_arrow.png", "right", "Gameplay/Recipe Types/Coke Oven");

    setSlot(recipe, 1, 28, 68, "slot.png");

    setSlot(recipe, 2, 10, 200, "slot.png");
    setSlot(recipe, 3, 46, 200, "fluid_slot.png");
});

document.querySelectorAll(".combustion").forEach(recipe => {
    recipe.style.height = "138px";
    recipe.style.width = "316px";
    addText(recipe);
    setArrow(recipe, 8, 132, "progress_bar_arrow_multiple.png", "right", "Gameplay/Recipe Types/Combustion Generator");

    setSlot(recipe, 1, 10, 68, "fluid_slot.png", "furnace_overlay_2.png");
});

//Component part assembly
//Compressor
//Cracker
//Cutter
//Cyclonic crystalline sieve
//Dimensional destabilisater
//Dimensional pinging

document.querySelectorAll(".distower").forEach(recipe => {
    recipe.style.height = "278px";
    recipe.style.width = "316px";
    addText(recipe);
    setArrow(recipe, 0, 0, "", "distower", "Gameplay/Recipe Types/Distillation Tower");

    setSlot(recipe, 1, 80, 36, "fluid_slot.png", "beaker_overlay_1.png");

    setSlot(recipe, 2, 8, 160, "fluid_slot.png", "beaker_overlay_2.png");
    setSlot(recipe, 3, 8, 196, "fluid_slot.png", "beaker_overlay_3.png");
    setSlot(recipe, 4, 8, 232, "fluid_slot.png", "beaker_overlay_4.png");
    setSlot(recipe, 5, 44, 160, "fluid_slot.png", "beaker_overlay_2.png");
    setSlot(recipe, 6, 44, 196, "fluid_slot.png", "beaker_overlay_3.png");
    setSlot(recipe, 7, 44, 232, "fluid_slot.png", "beaker_overlay_4.png");
    setSlot(recipe, 8, 80, 160, "fluid_slot.png", "beaker_overlay_2.png");
    setSlot(recipe, 9, 80, 196, "fluid_slot.png", "beaker_overlay_3.png");
    setSlot(recipe, 10, 80, 232, "fluid_slot.png", "beaker_overlay_4.png");
    setSlot(recipe, 11, 116, 160, "fluid_slot.png", "beaker_overlay_2.png");
    setSlot(recipe, 12, 116, 196, "fluid_slot.png", "beaker_overlay_3.png");
    setSlot(recipe, 13, 116, 232, "fluid_slot.png", "beaker_overlay_4.png");
    setSlot(recipe, 14, 152, 160, "slot.png", "dust_overlay.png");
});

//Distillery
//EBF
//EOF

document.querySelectorAll(".electrolizer").forEach(recipe => {
    recipe.style.height = "246px";
    recipe.style.width = "344px";
    addText(recipe);
    setArrow(recipe, 62, 146, "progress_bar_extract.png", "right", "Gameplay/Recipe Types/Electrolizer");

    setSlot(recipe, 1, 46, 28, "slot.png", "lightning_overlay_1.png");
    setSlot(recipe, 2, 46, 64, "slot.png", "canister_overlay.png");
    setSlot(recipe, 3, 82, 28, "fluid_slot.png", "lightning_overlay_2.png");

    setSlot(recipe, 4, 10, 214, "slot.png");
    setSlot(recipe, 5, 10, 250, "slot.png");
    setSlot(recipe, 6, 10, 286, "slot.png");
    setSlot(recipe, 7, 46, 214, "slot.png");
    setSlot(recipe, 8, 46, 250, "slot.png");
    setSlot(recipe, 9, 46, 286, "slot.png");
    setSlot(recipe, 10, 82, 214, "fluid_slot.png");
    setSlot(recipe, 11, 82, 250, "fluid_slot.png");
    setSlot(recipe, 12, 82, 286, "fluid_slot.png");
    setSlot(recipe, 13, 118, 214, "fluid_slot.png");
    setSlot(recipe, 14, 118, 250, "fluid_slot.png");
    setSlot(recipe, 15, 118, 286, "fluid_slot.png");
});

//Electromagnetic separator
//Essence burning
//Essence enchancing
//Essence replication
//Evaporation
//Exotic gas siphoning
//Extractor
//Extruder
//Fermenter
//Fluid heater
//Fluid solidifier
//Folding akreyrnium stabilisater
//Forge hammer
//Forming press
//Fusion reactor
//Gas collector
//Gas turbine
//Stargate assembly
//Mystical greenhouse
//Heat chamber
//Implosion compressor
//Large barrel
//Large boiler

document.querySelectorAll(".lchem").forEach(recipe => {
    recipe.style.height = "210px";
    recipe.style.width = "344px";
    addText(recipe);
    setArrow(recipe, 42, 146, "progress_bar_arrow_multiple.png", "right", "Gameplay/Recipe Types/Large Chemical Reactor");

    setSlot(recipe, 1, 10, 10, "slot.png", "molecular_overlay_1.png");
    setSlot(recipe, 2, 10, 46, "slot.png", "molecular_overlay_1.png");
    setSlot(recipe, 3, 10, 82, "slot.png", "molecular_overlay_2.png");
    setSlot(recipe, 4, 46, 10, "fluid_slot.png", "molecular_overlay_3.png");
    setSlot(recipe, 5, 46, 46, "fluid_slot.png", "molecular_overlay_3.png");
    setSlot(recipe, 6, 46, 82, "fluid_slot.png", "molecular_overlay_3.png");
    setSlot(recipe, 7, 82, 10, "fluid_slot.png", "molecular_overlay_3.png");
    setSlot(recipe, 8, 82, 46, "fluid_slot.png", "molecular_overlay_4.png");

    setSlot(recipe, 9, 10, 214, "slot.png", "vial_overlay_1.png");
    setSlot(recipe, 10, 10, 250, "slot.png", "vial_overlay_1.png");
    setSlot(recipe, 11, 10, 286, "slot.png", "vial_overlay_1.png");
    setSlot(recipe, 12, 46, 214, "fluid_slot.png", "vial_overlay_2.png");
    setSlot(recipe, 13, 46, 250, "fluid_slot.png", "vial_overlay_2.png");
    setSlot(recipe, 14, 46, 286, "fluid_slot.png", "vial_overlay_2.png");
    setSlot(recipe, 15, 82, 214, "fluid_slot.png", "vial_overlay_2.png");
});

//Large farm
//Large quantum compressor
//Large rock crusher
//Large rotor machine
//Large sieve
//Large stone barrel
//Laser engraver
//Lathe
//Leptonic convergence injector
//Leptonic manifold quantiser
//Macerator
//Mechanical sieve
//Mixer
//Multiblock info (to include Luna's multiblock renderer)
//Nuclear fission
//Ore processing diagram
//Ore vein diagram
//Ore washer
//Packer
//Ore processing plant
//Plasma generator
//Polarizer
//PBF
//Primitive ore factory
//Pyrolise oven
//Research station
//Rock breaker
//Rock filtrater
//Runic circuit assembly
//Runic inscribtion
//Scanner
//Sifter
//Stargate component assembly
//Steam boiler
//Steam turbine
//Stone barrel
//Super pressure heat chamber
//Thermal centrifuge
//Tree greenhouse
//Vacuum freezer
//Vibration laser engraver
//Void excavation
//Wiremill










function setArrow(recipeA, top = 10, left = 10, arrowimg = "progress_bar_arrow.png", type = "right", pagepath = "") {
    switch (type) {
        case "right":
    
            var arrB = document.createElement("a");
            arrB.classList.add("arrowBottom");
            arrB.style.top = top + "px";
            arrB.style.left = left + "px";
            arrB.style.setProperty("--height", "40px");
            arrB.style.setProperty("--width", "40px");
            arrB.style.backgroundImage = "url('/" + path + "assets/image/progress_bar/" + arrowimg + "')";
            arrB.href = "/" + path + pagepath;
            recipeA.appendChild(arrB);

            var arrA = document.createElement("div");
            arrA.classList.add("arrowTop");
            arrA.style.top = top + "px";
            arrA.style.left = left + "px";
            arrA.style.setProperty("--height", "40px");
            arrA.style.setProperty("--width", "40px");
            arrA.style.setProperty("--image", "url('../image/progress_bar/" + arrowimg + "')");
            arrA.style.setProperty("--anim", "arrowRight");
            arrA.style.setProperty("--timingf", "linear")
            recipeA.appendChild(arrA);

            var tooltip = document.createElement("span");
            tooltip.classList.add("tooltip");
            tooltip.style.left = "900px";
            tooltip.style.top = "300px";
            arrB.appendChild(tooltip);

            var txt = document.createElement("span");
            txt.textContent = "Show Recipes";
            tooltip.appendChild(txt);

            window.addEventListener('mousemove', function(event){
                if (arrB.matches(":hover")) {
                    tooltip.style.left = event.clientX + 14 + "px";
                    tooltip.style.top = event.clientY - 32 + "px";
                };
            });
            break;
        
        case "flame":

            var arrB = document.createElement("a");
            arrB.classList.add("arrowBottom");
            arrB.style.bottom = recipeA.style.height.replace("px", "")-36-12-top + "px";
            arrB.style.left = left + "px";
            arrB.style.setProperty("--height", "36px");
            arrB.style.setProperty("--width", "36px");
            arrB.style.backgroundImage = "url('/" + path + "assets/image/progress_bar/" + arrowimg + "')";
            arrB.href = "/" + path + pagepath;
            recipeA.appendChild(arrB);

            var arrA = document.createElement("div");
            arrA.classList.add("arrowTop");
            arrA.style.bottom = recipeA.style.height.replace("px", "")-36-12-top + "px";
            arrA.style.left = left + "px";
            arrA.style.setProperty("--height", "36px");
            arrA.style.setProperty("--width", "36px");
            arrA.style.setProperty("--image", "url('../image/progress_bar/" + arrowimg + "')");
            arrA.style.setProperty("--anim", "arrowFlame");
            arrA.style.setProperty("--timingf", "steps(36)")
            recipeA.appendChild(arrA);

            var tooltip = document.createElement("span");
            tooltip.classList.add("tooltip");
            tooltip.style.left = "900px";
            tooltip.style.top = "300px";
            arrB.appendChild(tooltip);

            var txt = document.createElement("span");
            txt.textContent = "Show Recipes";
            tooltip.appendChild(txt);

            window.addEventListener('mousemove', function(event){
                if (arrB.matches(":hover")) {
                    tooltip.style.left = event.clientX + 14 + "px";
                    tooltip.style.top = event.clientY - 32 + "px";
                };
            });
            break;

        case "assline":

            var arrB = document.createElement("div");
            arrB.classList.add("arrowBottom");
            arrB.style.top = "12px";
            arrB.style.left = "152px";
            arrB.style.setProperty("--height", "144px");
            arrB.style.setProperty("--width", "108px");
            arrB.style.backgroundImage = "url('/" + path + "assets/image/progress_bar/progress_bar_assembly_line.png')";
            recipeA.appendChild(arrB);

            var arrA = document.createElement("div");
            arrA.classList.add("arrowTop");
            arrA.style.top = "12px";
            arrA.style.left = "152px";
            arrA.style.setProperty("--height", "144px");
            arrA.style.setProperty("--width", "108px");
            arrA.style.setProperty("--image", "url('../image/progress_bar/progress_bar_assembly_line.png')");
            arrA.style.setProperty("--anim", "arrowAssline");
            arrA.style.setProperty("--timingf", "linear")
            recipeA.appendChild(arrA);

            var arrB = document.createElement("a");
            arrB.classList.add("arrowBottom");
            arrB.style.bottom = "174px";
            arrB.style.left = "270px";
            arrB.style.setProperty("--height", "36px");
            arrB.style.setProperty("--width", "20px");
            arrB.style.backgroundImage = "url('/" + path + "assets/image/progress_bar/progress_bar_assembly_line_arrow.png')";
            arrB.href = "/" + path + pagepath;
            recipeA.appendChild(arrB);

            var arrA = document.createElement("div");
            arrA.classList.add("arrowTop");
            arrA.style.bottom = "174px";
            arrA.style.left = "270px";
            arrA.style.setProperty("--height", "36px");
            arrA.style.setProperty("--width", "20px");
            arrA.style.setProperty("--image", "url('../image/progress_bar/progress_bar_assembly_line_arrow.png')");
            arrA.style.setProperty("--anim", "arrowFlame");
            arrA.style.setProperty("--timingf", "steps(36)")
            recipeA.appendChild(arrA);

            var tooltip = document.createElement("span");
            tooltip.classList.add("tooltip");
            tooltip.style.left = "900px";
            tooltip.style.top = "300px";
            arrB.appendChild(tooltip);

            var txt = document.createElement("span");
            txt.textContent = "Show Recipes";
            tooltip.appendChild(txt);

            window.addEventListener('mousemove', function(event){
                if (arrB.matches(":hover")) {
                    tooltip.style.left = event.clientX + 14 + "px";
                    tooltip.style.top = event.clientY - 32 + "px";
                };
            });
            break;

        case "distower":
            
            //Not perfect but I can't do better because of GT weird scallings on this recipe
            var arrB = document.createElement("div");
            arrB.classList.add("arrowBottom");
            arrB.style.top = "24px";
            arrB.style.left = 72-6.75+2 + "px";
            arrB.style.transform = "scaleX(1.25) translate(10%)";
            arrB.style.setProperty("--height", "150px");
            arrB.style.setProperty("--width", "130px");
            arrB.style.backgroundImage = "url('/" + path + "assets/image/progress_bar/progress_bar_distillation_tower.png')";
            recipeA.appendChild(arrB);

            var arrA = document.createElement("div");
            arrA.classList.add("arrowTop");
            arrA.style.top = "20px";
            arrA.style.left = 72-6.75+2 + "px";
            arrA.style.transform = "scaleX(1.25) translate(10%)";
            arrA.style.animationDuration = "4s";
            arrA.style.setProperty("--height", "150px");
            arrA.style.setProperty("--width", "130px");
            arrA.style.setProperty("--image", "url('../image/progress_bar/progress_bar_distillation_tower.png')");
            arrA.style.setProperty("--anim", "arrowDistower1");
            arrA.style.setProperty("--timingf", "linear")
            recipeA.appendChild(arrA);

            var arrB = document.createElement("div");
            arrB.classList.add("arrowBottom");
            arrB.style.bottom = "196px";
            arrB.style.left = "48px";
            arrB.style.setProperty("--height", "51px");
            arrB.style.setProperty("--width", "11px");
            arrB.style.backgroundImage = "url('/" + path + "assets/image/progress_bar/progress_bar_distillation_tower_bubbles.png')";
            recipeA.appendChild(arrB);

            var arrA = document.createElement("div");
            arrA.classList.add("arrowTop");
            arrA.style.bottom = "196px";
            arrA.style.left = "48px";
            arrA.style.animationDuration = "4s";
            arrA.style.setProperty("--height", "51px");
            arrA.style.setProperty("--width", "11px");
            arrA.style.setProperty("--image", "url('../image/progress_bar/progress_bar_distillation_tower_bubbles.png')");
            arrA.style.setProperty("--anim", "arrowDistower2");
            arrA.style.setProperty("--timingf", "linear")
            recipeA.appendChild(arrA);

            var arrB = document.createElement("a");
            arrB.classList.add("arrowBottom");
            arrB.style.bottom = "104px";
            arrB.style.left = "42px";
            arrB.style.setProperty("--height", "40px");
            arrB.style.setProperty("--width", "24px");
            arrB.style.backgroundImage = "url('/" + path + "assets/image/progress_bar/progress_bar_distillation_tower_coil.png')";
            arrB.href = "/" + path + pagepath;
            recipeA.appendChild(arrB);

            var arrA = document.createElement("div");
            arrA.classList.add("arrowTop");
            arrA.style.bottom = "104px";
            arrA.style.left = "42px";
            arrA.style.animationDuration = "4s";
            arrA.style.setProperty("--height", "40px");
            arrA.style.setProperty("--width", "24px");
            arrA.style.setProperty("--image", "url('../image/progress_bar/progress_bar_distillation_tower_coil.png')");
            arrA.style.setProperty("--anim", "arrowDistower3");
            arrA.style.setProperty("--timingf", "steps(36)")
            recipeA.appendChild(arrA);

            var tooltip = document.createElement("span");
            tooltip.classList.add("tooltip");
            tooltip.style.left = "900px";
            tooltip.style.top = "300px";
            arrB.appendChild(tooltip);

            var txt = document.createElement("span");
            txt.textContent = "Show Recipes";
            tooltip.appendChild(txt);

            window.addEventListener('mousemove', function(event){
                if (arrB.matches(":hover")) {
                    tooltip.style.left = event.clientX + 14 + "px";
                    tooltip.style.top = event.clientY - 32 + "px";
                };
            });
            break;
    }
};

function setSlot(recipeA, slotn = 1, top = 10, left = 10, slotimg = "slot.png", overlayimg = "empty.png") {
    var slot = document.createElement(recipeA.dataset["slot"+slotn] === undefined ? "div" : "a");
    slot.classList.add("slot");
    slot.style.top = top + "px";
    slot.style.left = left + "px";
    slot.style.backgroundImage = (overlayimg === undefined ? "" : "url('/" + path + "assets/image/slot/" + overlayimg + "'), ") + "url('/" + path + "assets/image/slot/" + slotimg + "')";
    var item = recipeA.dataset["slot"+slotn] === undefined ? undefined : recipeA.dataset["slot"+slotn].split(" ")[0];
    var qtt = recipeA.dataset["slot"+slotn] === undefined ? undefined : recipeA.dataset["slot"+slotn].split(" ")[1];

    if (item !== undefined) {
        if (pool[item] === undefined) {item = "missing_texture"};
        if (pool[item].set === undefined) {
            var itemTexture = document.createElement("div");
            itemTexture.classList.add("itemTexture");
            itemTexture.style.setProperty("--image", "url('../image/textures/" + pool[item].mod + "/" + item + ".png')");
            itemTexture.style.setProperty("--color", "rgb(255, 255, 255)");
            slot.appendChild(itemTexture);
        } else {

            var itemTexture = document.createElement("div");
            itemTexture.classList.add("itemTexture");
            itemTexture.style.setProperty("--image", "url('../ingot.png')");
            itemTexture.style.setProperty("--color", "rgb(115, 215, 61)");
            slot.appendChild(itemTexture);

            var itemTexture = document.createElement("div");
            itemTexture.classList.add("itemTexture");
            itemTexture.style.setProperty("--image", "url('../ingot_overlay.png')");
            itemTexture.style.setProperty("--color", "rgb(255, 255, 255)");
            slot.appendChild(itemTexture);

            var itemTexture = document.createElement("div");
            itemTexture.classList.add("itemTexture");
            itemTexture.style.setProperty("--image", "url('../ingot_secondary.png')");
            itemTexture.style.setProperty("--color", "rgb(24, 69, 55)");
            slot.appendChild(itemTexture);

        }



        slot.href = "/" + path + pool[item].url;

        var tooltip = document.createElement("span");
        tooltip.classList.add("tooltip");
        tooltip.style.left = "900px";
        tooltip.style.top = "300px";
        slot.appendChild(tooltip);

        var txt = document.createElement("span");
        txt.textContent = typeof pool[item].displayName === "string" ? pool[item].displayName : pool[item].displayName[0];
        if (typeof pool[item].displayName !== "string") {
            txt.style.color = pool[item].displayName[1];
            txt.style.textShadow = "2px 2px " + txt.style.color.replace(/\d+/g, n => Math.floor(n / 4));
        };
        tooltip.appendChild(txt);

        if (pool[item].chem !== undefined) {
            var txt = document.createElement("span");
            txt.textContent = pool[item].chem.replace(/([_^])(\d+)/g, (_, type, digits) => [...digits].map(d => type === '_' ? "₀₁₂₃₄₅₆₇₈₉"[d] : "⁰¹²³⁴⁵⁶⁷⁸⁹"[d]).join(''));;
            txt.classList.add("chemColor");
            tooltip.appendChild(txt);
        };

        if (pool[item].state !== undefined) {
            var txt = document.createElement("span");
            txt.textContent = "State: " + pool[item].state;
            txt.classList.add("stateColor");
            tooltip.appendChild(txt);
        };

        if (pool[item].lore !== undefined) {
            for (element of pool[item].lore) {
                var txt = document.createElement("span");
                txt.textContent = typeof element === "string" ? element : element[0];
                txt.style.display = "block";
                txt.style.color = typeof element === "string" ? "rgb(168, 168, 168)" : element[1];
                txt.style.textShadow = "2px 2px " + txt.style.color.replace(/\d+/g, n => Math.floor(n / 4));
                tooltip.appendChild(txt);
            }
        };

        if (pool[item].temp !== undefined) {
            var txt = document.createElement("span");
            txt.textContent = "Temperature: ";
            txt.classList.add("tempColor");
            tooltip.appendChild(txt);

            var txt = document.createElement("span");
            txt.textContent = pool[item].temp;
            tooltip.appendChild(txt);
        };

        var txt = document.createElement("span");
        txt.textContent = pool[item].mod;
        txt.classList.add("modColor");
        tooltip.appendChild(txt);

        window.addEventListener('mousemove', function(event){
            if (slot.matches(":hover")) {
                tooltip.style.left = event.clientX + 14 + "px";
                tooltip.style.top = event.clientY - 32 + "px";
            };
        });

        if (pool[item].animated) {
            getjson(recipeA, slot, item);
        };
    };

    if (qtt !== undefined) {
        var quantity = document.createElement("span");
        quantity.textContent = qtt;
        quantity.classList.add(qtt.includes("B") ? "qttFluid" : "qttItem");
        slot.appendChild(quantity);
    };

    recipeA.appendChild(slot);
};

async function getjson(recipe, slot, item) {
    const response = await fetch(new Request("/" + path + "assets/image/textures/" + pool[item].mod + "/" + item + ".png.mcmeta"));
    const object = await response.json();

    getimg(recipe, slot, item, object);
};

function getimg(recipe, slot, item, object) {
    const img = new Image()
    img.src = "/" + path + "assets/image/textures/" + pool[item].mod + "/" + item + ".png"
    img.onload = function() {
        anim(recipe, slot, item, object, this.naturalHeight/16);
    };
};

function anim(recipe, slot, item, object, frame) {
    if (object.animation.interpolate) console.log(`${item} has "interpolate":true in its .mcmeta file, which is not supported yet. Set pool.${item}.animated = false to avoid a wrong animation.`)
    object.animation.frametime ??= 1;
    object.animation.frames ??= Array.from({length: frame}, (_, i) => i);

    var duration = 0;
    for (i in object.animation.frames) {
        if (typeof object.animation.frames[i] === "number") {
            object.animation.frames[i] = {index: object.animation.frames[i], time: object.animation.frametime}
        };
        duration += object.animation.frames[i].time
    };

    var keyframe = `@keyframes ${item.replace(/\./g, '\\.')} {`;
    var durationcum = 0;
    for (i in object.animation.frames) {
        keyframe += `${100*durationcum/duration}% {background-position-y: -${32*object.animation.frames[i].index}px;} `;
        durationcum += object.animation.frames[i].time;
    };
    keyframe += `100% { background-position-y: -${32*object.animation.frames[0].index}px; }}`;

    slot.classList.add("slotAnim");
    slot.style.setProperty("--duration", duration/20+"s");
    slot.style.setProperty("--name", item.replace(/\./g, '\\.'));
    const style = document.createElement('style');
    style.innerHTML = keyframe;

    document.head.appendChild(style);
};

function updateText(recipeB, textbox, recipetierB, boldererB, hystoryB) {
    //used in addText()

    textbox.textContent = (recipeB.dataset.duration === undefined ? "" : "Duration: " + (hystoryB[hystoryB.length-1][0]/20).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " secs\n")
                        + (recipeB.dataset.duration === undefined || recipeB.dataset.usage === undefined ? "" : "Total: " + (hystoryB[hystoryB.length-1][1] * 20 * hystoryB[hystoryB.length-1][0]/20).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " EU\n") //à addapter pour OC/POC
                        + (recipeB.dataset.duration === undefined || recipeB.dataset.generation === undefined ? "" : "Total: " + (recipeB.dataset.generation * 20 * recipeB.dataset.duration).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " EU\n")
                        + (recipeB.dataset.mincomput === undefined || recipeB.dataset.usage === undefined ? "" : "Max. EU: " + (hystoryB[hystoryB.length-1][1] * 20 * hystoryB[hystoryB.length-1][0]/20).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " EU\n") //à addapter pour OC/POC
                        + (recipeB.dataset.usage === undefined ? "" : "Usage: " + (hystoryB[hystoryB.length-1][1]).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " EU/t\n")
                        + (recipeB.dataset.generation === undefined ? "" : "Generation: " + recipeB.dataset.generation.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " EU/t\n")
                        + (recipeB.dataset.temp === undefined ? "" : "Temp: " + recipeB.dataset.temp.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "K\n")
                        + (recipeB.dataset.coil === undefined ? "" : "Coil: " + recipeB.dataset.coil)
                        + (recipeB.dataset.e2start === undefined ? "" : "Energy To Start: " + recipeB.dataset.e2start.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "MEU\n")
                        + (recipeB.dataset.mincomput === undefined ? "" : "Min. Computation: " + recipeB.dataset.mincomput.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " CWU/t\nComputation: " + (4000*recipeB.dataset.mincomput).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " CWU\n")
                        + (recipeB.dataset.note === undefined ? "" : recipeB.dataset.note);

                        //Possible notes :
                        // - Requires Research
                        // - Requires Cleanroom
                        // - Requires Sterile Cleanroom
                        // - Fluid Blocks Around

                        //Not addapted for : Bedrock fluid diagram, Multiblock info (title), Ore vein diagram

                        //fusion reactor : energy tier une ligne plus haut
                        //gas turbine, steam turbine : toujours la même generation (32 EU/t), pas besoin de variable ?
                        //nuclear fission : idem (4,096 EU/t) ?

                        //EMI (epsilon) (osef)
                        // - ore diagram, assembler, centrifuge, electrolizer, circuit assembler, research station, distillation tower, assembly line, alloy blast smelter, heat chamber, exotic gas siphoning, super pressure heat chamber, chemical plant, stargate component assembly, quantum compressor

    recipetierB.childNodes[0].nodeValue = tier[tier.indexOf(recipeB.dataset.tier)+hystoryB.length-1];
    recipetierB.style.color = color[tier.indexOf(recipeB.dataset.tier)+hystoryB.length-1];
    boldererB.textContent = tier[tier.indexOf(recipeB.dataset.tier)+hystoryB.length-1];
    boldererB.style.color = color[tier.indexOf(recipeB.dataset.tier)+hystoryB.length-1];
    boldererB.style.display = tier.indexOf(recipeB.dataset.tier)+hystoryB.length >= 14 ? "block" : "none";
    recipetierB.style.letterSpacing = tier.indexOf(recipeB.dataset.tier)+hystoryB.length >= 14 ? "2px" : "0px";
    boldererB.style.letterSpacing = tier.indexOf(recipeB.dataset.tier)+hystoryB.length >= 14 ? "2px" : "0px";
};

function addText(recipeA, top) {
    var hystory = [[recipeA.dataset.mincomput === undefined ? recipeA.dataset.duration*20 : 4000, recipeA.dataset.usage]];

    var recipeinfo = document.createElement("div");
    recipeinfo.classList.add("recipeinfo");
    recipeinfo.style.top = (top ?? Number(recipeA.style.height.replace("px", "")) - 77) + "px";
    recipeA.appendChild(recipeinfo);

    var recipetier = document.createElement("span");
    recipetier.classList.add("recipetier");
    recipeA.appendChild(recipetier);

    var bolderer = document.createElement("span");
    bolderer.classList.add("bolderer");
    recipeA.appendChild(bolderer);

    recipetier.textContent = "Error...";
    updateText(recipeA, recipeinfo, recipetier, bolderer, hystory);
    
    //click event that should work on any browser with the three main buttons
    var edown = null;
    recipetier.addEventListener('contextmenu', function(event) {event.preventDefault();});
    recipetier.addEventListener('mousedown', function (event) {edown = event.target;});
    window.addEventListener('mouseup', function (event) {
        if (edown === event.target) {
            switch (event.button) {
                case 0:
                    //alert(tier.indexOf(recipeA.dataset.tier)+hystory.length)
                    if (tier.indexOf(recipeA.dataset.tier)+hystory.length < tier.length) {
                        if (Math.floor(hystory[hystory.length-1][0] / (2*(event.shiftKey+1))) > 0 ) {
                            hystory.push([Math.floor(hystory[hystory.length-1][0] / (2*(event.shiftKey+1))), hystory[hystory.length-1][1] * 4]);
                        } else {
                            hystory.push(hystory[hystory.length-1])
                        }
                    }
                    break;
                case 1:
                    hystory = [[recipeA.dataset.mincomput === undefined ? recipeA.dataset.duration*20 : 4000, recipeA.dataset.usage]];
                    break;
                case 2:
                    if (hystory.length >= 2) {
                        hystory.pop();
                    }
                    break;
            }
            updateText(recipeA, recipeinfo, recipetier, bolderer, hystory);
            //alert("mouse button : " + event.button + " ; " + recipeA.dataset.tier)
        }
        edown = null;
    });

    //Tooltip for the tier button
    //If a recipe need OpV tier or higher, the tier won't be bold in the tier button tooltip (Min: OpV)
    var tooltipA = document.createElement("span");
    tooltipA.classList.add("tooltip");
    tooltipA.style.left = "900px";
    tooltipA.style.top = "300px";
    tooltipA.style.letterSpacing = "0px";
    recipetier.appendChild(tooltipA);

    var txt = document.createElement("span");
    txt.textContent = "Min:";
    tooltipA.appendChild(txt);

    var txt = document.createElement("span");
    txt.textContent = " " + recipeA.dataset.tier;
    txt.style.color = color[tier.indexOf(recipeA.dataset.tier)];
    tooltipA.appendChild(txt);

    var txt = document.createElement("span");
    txt.textContent = "Left click to increase the OC";
    txt.style.display = "block"
    tooltipA.appendChild(txt);

    var txt = document.createElement("span");
    txt.textContent = "Right click to decrease the OC";
    txt.style.display = "block"
    tooltipA.appendChild(txt);

    var txt = document.createElement("span");
    txt.textContent = "Middle click to reset the OC";
    txt.style.display = "block"
    tooltipA.appendChild(txt);

    var txt = document.createElement("span");
    txt.textContent = "Hold Shift to change by Perfect OC";
    txt.style.display = "block"
    tooltipA.appendChild(txt);

    window.addEventListener('mousemove', function(event){
        if (recipetier.matches(":hover")) {
            tooltipA.style.left = event.clientX + 14 + "px";
            tooltipA.style.top = event.clientY - 32 + "px";
        }
    });
};

/*to-do:
- Tooltip on left size of the mouse ?
- Block items display
- Animations with "interpolate":true (like OpV stuffs)
- Other progressbar type
- Overclock from UlV
- NC (not consumed) + in tooltip
- Idem with chance (some have (XOR) mentionned)
- Item with different tooltip depending of the recipes (eg. bacteria)
- Multiple items possible in a slot, alterning when not holding shift
- Item without its own texture, but using a base texture recolored (eg. dusts)
*/